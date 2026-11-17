import type { Article } from './types';

const article: Article = {
  slug: 'ai-portfolio-projects-for-gohighlevel-jobs',
  title: 'Five AI portfolio projects that get GoHighLevel specialists hired',
  description:
    'Five weekend AI builds inside a HighLevel sub-account: what to build, what to measure, and how to write each up so GoHighLevel employers can judge your work.',
  category: 'Career Moves',
  publishedAt: '2026-11-14',
  readingMinutes: 6,
  cover: '/articles/ai-portfolio-projects-for-gohighlevel-jobs.jpg',
  coverAlt:
    'Abstract illustration of five connected blue tiles arranged like a workflow diagram on a light grid',
  keyTakeaways: [
    'A small AI build that solves one business problem, with numbers from your own testing, says more than a list of AI tools on a CV.',
    'Each of these five projects fits in a weekend inside a HighLevel sandbox or sub-account you control.',
    'Write every project up the same way: problem, build, result, and what you would change.',
    'Put one or two of your strongest projects at the top of each application, matched to the job post.',
  ],
  body: [
    {
      type: 'p',
      text: "Writing \"experienced with AI\" on a CV is easy, which is why it rarely convinces anyone. What convinces a hiring manager is proof. These five AI portfolio projects get GoHighLevel specialists hired because each one solves a problem an agency client actually pays to fix, and each can be finished in a weekend inside a sandbox or a sub-account you control. Use invented business details, never real client data.",
    },
    {
      type: 'h2',
      text: 'How to write up every project',
      id: 'how-to-write-up',
    },
    {
      type: 'p',
      text: 'Hiring managers skim. Give each project the same four-part write-up so they can compare your work quickly:',
    },
    {
      type: 'ol',
      items: [
        '**Problem:** one or two sentences on the business pain, in the client\'s words.',
        '**Build:** the triggers, actions, AI settings, and fields you used, with two or three screenshots.',
        '**Result:** what you measured in testing, stated honestly as test results, not client results.',
        '**What I would change:** the limits you found and your next step. This part shows judgment, so never skip it.',
      ],
    },
    {
      type: 'p',
      text: 'Add a short screen recording (two minutes is plenty) of the build working end to end.',
    },
    {
      type: 'h2',
      text: '1. A lead follow-up bot with a knowledge base',
      id: 'lead-follow-up-bot',
    },
    {
      type: 'p',
      text: "**Problem:** a local business gets form leads in the evening and replies the next morning, by which time the lead has called someone else.",
    },
    {
      type: 'p',
      text: "**Build:** a simple opt-in funnel feeding a Conversation AI bot. HighLevel's help center describes Conversation AI as an agent that can run in Suggestive Mode (it drafts replies a person reviews and sends) or Autopilot Mode (it replies on its own), trained through Bot Training on sources such as knowledge bases, documents, URLs, and FAQs. Write a knowledge base for an invented business, set a bot goal of booking an appointment, and start in Suggestive Mode. If you have no front end to attach this to, [Super Cloner](https://supercloner.app/?ref=3nojbk), a Chrome extension that copies a funnel page into your own HighLevel builder as editable pages, can give your demo a realistic opt-in page to rebrand.",
    },
    {
      type: 'p',
      text: '**Measure:** run 20 scripted test conversations and record how many got a correct answer, how many booked, and how many times the bot guessed instead of handing off.',
    },
    {
      type: 'p',
      text: '**Write-up angle:** show one conversation where the bot handed off correctly and one where it guessed, then explain the knowledge base change that fixed it. Under what you would change, note when you would trust it in Autopilot Mode.',
    },
    {
      type: 'h2',
      text: '2. Missed-call text-back with an AI qualifier',
      id: 'missed-call-ai-qualifier',
    },
    {
      type: 'p',
      text: '**Problem:** a trades business misses calls while on jobs, and those callers rarely leave voicemail.',
    },
    {
      type: 'p',
      text: "**Build:** turn on Missed Call Text Back in the sub-account's phone system settings and write a short message. According to HighLevel's help center, it sends one SMS for every missed call (including repeat calls in a short window), so add a workflow with a wait step or tag filter to avoid duplicates. Then have Conversation AI pick up the reply, ask two or three qualifying questions (job type, postcode, urgency), and save the answers to custom fields.",
    },
    {
      type: 'p',
      text: '**Measure:** with test calls from a second phone, track how many conversations completed qualification, how many duplicate texts went out before and after your fix, and how long the full exchange took.',
    },
    {
      type: 'p',
      text: '**Write-up angle:** lead with the duplicate-text fix, because it shows you read the documentation and tested past the happy path. Under what you would change, mention handling callers who reply with a question instead of an answer.',
    },
    {
      type: 'callout',
      title: 'Check messaging rules',
      text: 'SMS consent and business messaging rules vary by country and state. Note in your write-up which rules a real client would need to check before launch.',
    },
    {
      type: 'h2',
      text: '3. A review-reply workflow with human approval',
      id: 'review-reply-approval',
    },
    {
      type: 'p',
      text: '**Problem:** a clinic owner knows replying to reviews matters but never finds the time, and worries an AI will say the wrong thing.',
    },
    {
      type: 'p',
      text: "**Build:** use Reviews AI in Suggestive mode, where the AI drafts a response and a person chooses to send it. HighLevel's help center lists three modes: Off, Suggestive, and Auto Responses, and Auto Responses can be tailored by star rating and review source. A sensible design to demonstrate: suggestions for everything, with a written rule that negative or mixed reviews always get a human edit. Document the tone guidelines you gave it.",
    },
    {
      type: 'p',
      text: '**Measure:** write 15 sample reviews across star ratings, generate replies, and score each as usable as-is, needed edits, or unusable. That approval rate is a strong number to show.',
    },
    {
      type: 'p',
      text: '**Write-up angle:** include your tone guidelines and one before-and-after edit of a negative review reply. Under what you would change, describe which star ratings you would let a client move to Auto Responses, and what evidence you would want first.',
    },
    {
      type: 'h2',
      text: '4. Lead enrichment and routing with an AI step',
      id: 'lead-enrichment-routing',
    },
    {
      type: 'p',
      text: '**Problem:** an agency\'s form asks "How can we help?" and every lead lands in one pile, so urgent jobs wait behind tyre kickers.',
    },
    {
      type: 'p',
      text: '**Build:** a workflow triggered by the form. Add the "GPT powered by OpenAI" action, map the free-text answer into the prompt, and ask for a single category and an urgency level in a fixed format. HighLevel notes the output can be saved to a custom field. Then use If/Else branches on that field to assign the right user, add a tag, and move the opportunity to the right pipeline stage.',
    },
    {
      type: 'p',
      text: '**Measure:** feed in 30 test submissions you labelled yourself beforehand. Report how many the AI classified the same way you did, and show two it got wrong and how you changed the prompt.',
    },
    {
      type: 'p',
      text: '**Write-up angle:** include the exact prompt and output format, since a fixed format is what makes the branching reliable. Under what you would change, mention a fallback branch for outputs that match no category.',
    },
    {
      type: 'h2',
      text: '5. A plain-English client reporting summary',
      id: 'client-reporting-summary',
    },
    {
      type: 'p',
      text: '**Problem:** account managers spend hours each month turning dashboards into emails clients will actually read.',
    },
    {
      type: 'p',
      text: '**Build:** store a few monthly numbers for an invented client in custom fields (leads, booked appointments, reviews received). A workflow passes them to the GPT action with a prompt that writes a five-sentence summary: what changed, one likely reason, and one recommended next step. Send it to yourself as an internal draft so a person reviews it before any client sees it.',
    },
    {
      type: 'p',
      text: '**Measure:** time how long a manual summary takes you versus reviewing the AI draft, and check every number in the output against the source. Report any time the AI got a figure wrong, because that is exactly what a careful employer will ask about.',
    },
    {
      type: 'p',
      text: '**Write-up angle:** show one raw set of numbers next to the summary it produced. Under what you would change, mention adding a comparison with the previous month and a check that blocks sending if a number is missing.',
    },
    {
      type: 'callout',
      title: 'Honest numbers only',
      text: 'Your results come from test data, so label them that way. "18 of 20 test conversations booked correctly" is believable and checkable. Invented client revenue figures will cost you the interview.',
    },
    {
      type: 'h2',
      text: 'How to present your portfolio on a job application',
      id: 'presenting-your-portfolio',
    },
    {
      type: 'p',
      text: 'Five projects is a portfolio, but an application only needs the one or two that match the job. Before you apply:',
    },
    {
      type: 'ul',
      items: [
        '**Host the write-ups on one page** (a simple site, a shared doc, or a HighLevel funnel page) with a short recording embedded for each.',
        '**Match the project to the post.** Applying for an automation role? Lead with project 4. Reputation or client success? Lead with projects 3 and 5.',
        '**Put the link in the first two lines** of your application and name the result: "Built a lead routing workflow that matched my manual labels on 27 of 30 test leads."',
        '**Offer a snapshot or walkthrough call** so a hiring manager can see the build, not just screenshots.',
        '**Keep it current.** HighLevel AI features change often, so rebuild or update a project when a feature you used changes.',
      ],
    },
    {
      type: 'p',
      text: 'Pick one project this weekend, finish the write-up on Sunday, and start applying to [open GHL roles](/jobs) with it on Monday.',
    },
  ],
  faq: [
    {
      q: 'Can I build these projects without a paying client?',
      a: 'Yes. Use a sandbox or a sub-account you control with an invented business. Label your results as test results, which employers respect more than unverifiable claims.',
    },
    {
      q: 'How many portfolio projects do I need to get a GoHighLevel job?',
      a: 'One well documented project that matches the role is enough to start applying. Three covering different skills (conversation, automation, reporting) give you something to match to most job posts.',
    },
    {
      q: 'Should I use Suggestive or Autopilot mode in my demo?',
      a: 'Starting in a suggestive or approval mode shows good judgment, because agencies are cautious about AI speaking for clients. Explain in your write-up what testing would need to show before you would switch a client to automatic replies.',
    },
    {
      q: 'Is it okay to share a snapshot of my portfolio build with employers?',
      a: 'Sharing a snapshot of your own demo account is a good way to show real work. Make sure it contains only invented data and no API keys or personal information.',
    },
  ],
  sources: [
    {
      label: 'HighLevel Help Center: Conversation AI Bot Explained',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000001335-conversation-ai-bot-explained',
    },
    {
      label: 'HighLevel Help Center: Where and How to Configure the Missed Call Text Back Feature',
      url: 'https://help.gohighlevel.com/support/solutions/articles/48001239140-where-and-how-to-configure-the-missed-call-text-back-feature',
    },
    {
      label: 'HighLevel Help Center: Reviews AI Suggestive and Auto-Pilot Modes',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000001074',
    },
    {
      label: 'HighLevel Help Center: GPT-5 in HighLevel Workflows',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000005919-gpt-5-in-highlevel-workflows',
    },
    {
      label: 'HighLevel Help Center: GPT-4 in HighLevel',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000002331-gpt-4-in-highlevel',
    },
  ],
  relatedSearch: 'funnel',
};

export default article;
