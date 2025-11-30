import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import cocktailsData from '@/lib/data/cocktails.json'
import dryHireData from '@/lib/data/dry_hire_logic.json'
import rulesData from '@/lib/data/rules.json'

export const maxDuration = 30

const systemPrompt = `You are the Black Orchid Concierge, an ultra-luxury bartending service consultant.

BRAND VOICE: Sophisticated, discreet, impeccably professional. You represent a "Digital Speakeasy" - exclusive, noir, and elegant.

DRY HIRE MODEL: ${dryHireData.disclaimer}

YOUR RESPONSIBILITIES:
1. Help clients calculate shopping lists for spirits (they buy retail at Costco/Total Wine)
2. Recommend our premium mixer packages and service upgrades
3. Suggest cocktail menus and recipes
4. Enforce TABC safety compliance (1 bartender per 50-75 guests)
5. Connect clients with our approved bartenders

COMPLIANCE: ${rulesData.compliance.minors} | ${rulesData.compliance.last_call} | ${rulesData.compliance.staff_ratio}

Always maintain an exclusive, high-end tone. You're not just booking bartenders - you're curating exceptional experiences.`

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: openai('gpt-4-turbo'),
    system: systemPrompt,
    messages,
    tools: {
      get_recipe: tool({
        description: 'Search for cocktail recipes by name or type (e.g., "margarita", "whiskey", "spirit-forward")',
        parameters: z.object({
          keyword: z.string().describe('Cocktail name or type to search for'),
        }),
        execute: async ({ keyword }) => {
          const results = cocktailsData.filter(
            (cocktail) =>
              cocktail.name.toLowerCase().includes(keyword.toLowerCase()) ||
              cocktail.type.toLowerCase().includes(keyword.toLowerCase()) ||
              cocktail.flavor_profile.toLowerCase().includes(keyword.toLowerCase())
          )
          if (results.length === 0) {
            return { success: false, message: 'No cocktails found matching that query.' }
          }
          return { success: true, results }
        },
      }),

      estimate_shopping_list: tool({
        description: 'Calculate how many bottles of alcohol to buy based on guest count and event duration',
        parameters: z.object({
          guests: z.number().describe('Number of guests'),
          hours: z.number().describe('Event duration in hours'),
          drinking_level: z.enum(['light', 'moderate', 'heavy']).describe('Expected drinking level'),
        }),
        execute: async ({ guests, hours, drinking_level }) => {
          const drinksPerHour = dryHireData.formula[`${drinking_level}_drinking`].drinks_per_hour
          const totalDrinks = guests * hours * drinksPerHour
          const servingsPerBottle = dryHireData.bottle_math.spirits_750ml.servings_per_bottle
          const bottlesNeeded = Math.ceil(totalDrinks / servingsPerBottle)
          
          return {
            total_drinks_estimate: totalDrinks,
            bottles_needed: bottlesNeeded,
            breakdown: `For ${guests} guests over ${hours} hours (${drinking_level} drinking), you'll need approximately ${bottlesNeeded} bottles (750ml).`,
            recommendation: 'We suggest 40% vodka, 20% whiskey, 20% tequila, 10% gin, 10% rum split.',
            upsells: dryHireData.upsells,
            shopping_guide: dryHireData.shopping_list_template,
          }
        },
      }),

      check_safety: tool({
        description: 'Check if enough bartenders are scheduled based on guest count (TABC compliance)',
        parameters: z.object({
          guests: z.number().describe('Number of guests'),
          bartenders: z.number().describe('Number of bartenders planned'),
        }),
        execute: async ({ guests, bartenders }) => {
          const minRequired = Math.ceil(guests / 75)
          const recommended = Math.ceil(guests / 50)
          const isCompliant = bartenders >= minRequired
          
          return {
            is_compliant: isCompliant,
            min_required: minRequired,
            recommended: recommended,
            current_ratio: `1 bartender per ${Math.ceil(guests / bartenders)} guests`,
            message: isCompliant
              ? `✓ TABC compliant. ${recommended > bartenders ? `However, we recommend ${recommended} for optimal service.` : 'Perfect staffing level.'}`
              : `⚠ NOT COMPLIANT. You must have at least ${minRequired} bartenders for ${guests} guests.`,
          }
        },
      }),

      search_talent: tool({
        description: 'Search for available bartenders by date and location',
        parameters: z.object({
          event_date: z.string().describe('Event date in ISO format (YYYY-MM-DD)'),
          service_area: z.string().optional().describe('Service area or city'),
        }),
        execute: async ({ event_date, service_area }) => {
          const supabase = await createClient()
          
          let query = supabase
            .from('bartender_details')
            .select('*, profiles!inner(full_name, avatar_url)')
            .eq('approval_status', 'approved')
          
          if (service_area) {
            query = query.ilike('service_area', `%${service_area}%`)
          }
          
          const { data, error } = await query
          
          if (error) {
            return { error: 'Failed to search bartenders' }
          }
          
          return {
            count: data?.length || 0,
            bartenders: data?.map((b: any) => ({
              name: b.profiles.full_name,
              hourly_rate: b.hourly_rate,
              years_experience: b.years_experience,
              specialties: b.specialties,
              service_area: b.service_area,
              is_tabc_certified: b.is_tabc_certified,
            })) || [],
          }
        },
      }),

      get_upsells: tool({
        description: 'Get available premium add-ons and service packages',
        parameters: z.object({}),
        execute: async () => {
          return {
            packages: dryHireData.upsells,
            message: 'Here are our premium service upgrades to elevate your event:',
          }
        },
      }),
    },
  })

  return result.toDataStreamResponse()
}
