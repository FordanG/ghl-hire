import type { Article } from './types';

const article: Article = {
  slug: 'ai-skills-gohighlevel-agencies-hire-for',
  title: 'The AI skills GoHighLevel agencies now hire for',
  description:
    "Six AI skills GoHighLevel agencies now look for when hiring: agent building, knowledge bases, AI workflow steps, QA, data hygiene and client handover.",
  category: 'AI Skills',
  publishedAt: '2026-11-18',
  readingMinutes: 6,
  cover: '/articles/ai-skills-gohighlevel-agencies-hire-for.jpg',
  coverAlt:
    'Abstract illustration of connected nodes and flowing lines forming a workflow diagram on a soft blue background',
  keyTakeaways: [
    'The AI skills GoHighLevel agencies hire for are mostly about setup, testing and judgement, not about knowing which buttons exist.',
    'A knowledge base is only as good as the content you feed it, so clean, explicit source material is a hireable skill on its own.',
    'Proof beats claims: a short test log, a before and after transcript, or an execution trace says more than "AI expert" on a profile.',
    'You can practise every skill in this guide inside a single test sub-account this week.',
  ],
  body: [
    {
      type: 'p',
      text: "HighLevel now ships AI inside the platform: chat agents, voice agents, a visual agent builder and AI steps inside workflows. That changes what agencies need from the people they hire. Knowing where the settings live is no longer enough, because anyone can find a toggle. The AI skills GoHighLevel agencies now hire for are the ones that make those features behave well for a real client: building agents that stay on task, feeding them good information, testing them properly, and handing them over so the client trusts them.",
    },
    {
      type: 'p',
      text: "Below are six skills, each with what it means in practice, what proof of it looks like in a portfolio, and one way to practise it this week. Feature names are taken from HighLevel's own help centre, but the interface changes often, so check the current help article before you build anything for a client.",
    },
    {
      type: 'h2',
      text: '1. Building and tuning conversation and voice agents',
      id: 'conversation-and-voice-agents',
    },
    {
      type: 'p',
      text: "HighLevel groups its agents under AI Agents: **Conversation AI** for chat, **Voice AI** for calls, and **Agent Studio**, a node-based canvas for building custom agents with routers, knowledge search, API calls and data collection steps. Conversation AI has three response modes: Off, Suggestive (the AI drafts and a human sends) and Autopilot (the AI replies on its own). HighLevel's Skills Platform article recommends giving each agent only the skills its role needs and expanding from there.",
    },
    {
      type: 'p',
      text: "The hireable skill is not switching an agent on. It is choosing the right mode for the client's risk level, scoping what the agent is allowed to do, and tuning it after real conversations come in. An agency wants someone who will start a nervous client on Suggestive mode, review a week of drafts, then move to Autopilot with evidence.",
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a one-page agent spec for a sample business (goal, channels, mode, allowed actions, what it must never do), plus screenshots of the finished setup.',
        '**Proof:** a before and after transcript showing a reply that improved after you changed the instructions or sources.',
        '**Practise this week:** build one Conversation AI agent for a made-up dental clinic in a test sub-account, run it in Suggestive mode, and write down five replies you would change and why.',
      ],
    },
    {
      type: 'h2',
      text: '2. Writing prompts and knowledge bases',
      id: 'prompts-and-knowledge-bases',
    },
    {
      type: 'p',
      text: "Agents answer from two things: their instructions and their knowledge sources. HighLevel's training guide lists the source types as Web Crawler, FAQ, Rich Text, File Upload, Tables, Web Search and Google Drive. It advises against crawling every page of a site and suggests leaving out outdated, duplicated, navigation-only and legal boilerplate pages. It also recommends stating prices, limits and policies explicitly and removing conflicting versions of the same information.",
    },
    {
      type: 'p',
      text: "That advice describes a real job. Most small business websites are vague about prices, hours and service areas, and an agent trained on vague content gives vague answers. The person who rewrites that material into clear FAQs, a pricing table and a short policy document is doing the work that decides whether the agent is useful. Note one detail when you plan a build: HighLevel's help centre says a Voice AI agent links to one knowledge base at a time, while Conversation AI can use several.",
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a knowledge base pack for a sample business: 20 FAQs, a pricing table and a list of pages you chose to exclude, with one line explaining each exclusion.',
        '**Proof:** a short set of agent instructions with a clear role, tone, scope and an explicit "if you do not know, say so and offer a booking" rule.',
        '**Practise this week:** take a real local business website, list which pages you would crawl and which you would skip, then write the ten FAQs the site fails to answer clearly.',
      ],
    },
    {
      type: 'h2',
      text: '3. Designing workflows with AI steps',
      id: 'workflows-with-ai-steps',
    },
    {
      type: 'p',
      text: "In the workflow builder, HighLevel has an **AI Agent** action under the Workflow AI section. According to its help article, it plans and runs multi-step tasks from plain-language instructions using tools you allow, such as Search Knowledge Base, Send SMS, Update Contact Field and Add Tag, with up to ten tools per agent. HighLevel describes it as a premium action, and each run is charged, so check current pricing in your account before you design around it.",
    },
    {
      type: 'p',
      text: "This is where workflow experience becomes more valuable, not less. Someone still has to decide which steps should be fixed logic (always tag, always notify) and which genuinely need AI judgement (read a reply and decide the next step). Putting an AI step where a simple If/Else would do adds cost and unpredictability. Agencies want people who can explain that trade-off to a client.",
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a workflow diagram or screenshot with a note on why each AI step is AI and not a standard action.',
        '**Proof:** an execution trace from a test run with a short explanation of what the agent did.',
        '**Practise this week:** rebuild one of your existing lead follow-up workflows on paper, mark every step as "fixed" or "needs judgement", and only then decide where an AI step would earn its cost.',
      ],
    },
    {
      type: 'h2',
      text: '4. Testing and QA of AI outputs',
      id: 'testing-and-qa',
    },
    {
      type: 'p',
      text: "This is the skill most often missing, and the one that protects an agency's reputation. HighLevel gives you the tools: a Knowledge Base Retrieval Tester to check whether content can be found, a bot test panel that HighLevel suggests using with a common question, a paraphrased version, an FAQ and an out-of-scope question, a Test feature in Agent Studio before publishing, Response Info in Conversations to see which sources produced a reply, and Execution Logs for the AI Agent workflow action showing each model call and tool step.",
    },
    {
      type: 'callout',
      title: 'A simple test sheet beats a vague "I tested it"',
      text: 'Keep a spreadsheet with four columns: the question you asked, what the agent said, pass or fail, and what you changed. Twenty rows covering normal questions, rephrased questions, pricing, booking, angry customers and off-topic requests is a solid first pass for most small business agents.',
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a completed test sheet for a sample agent, including the failures and how you fixed them.',
        '**Practise this week:** write 20 test questions for the agent you built in section 1, run them, and retest after every change.',
      ],
    },
    {
      type: 'h2',
      text: '5. Data hygiene',
      id: 'data-hygiene',
    },
    {
      type: 'p',
      text: "AI agents read and write CRM data. If custom fields are duplicated, tags are inconsistent and contacts have three phone formats, an agent will book the wrong person, miss context or tag leads into the wrong pipeline. Clean data was always useful. Now that software acts on it without a human checking each step, it matters more.",
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a before and after audit of a sub-account: duplicate fields merged, a tag naming convention, and a short data dictionary listing what each custom field is for.',
        '**Practise this week:** write a tag and custom field naming convention for your own test account and apply it, then document it in one page a client could follow.',
      ],
    },
    {
      type: 'h2',
      text: '6. Client handover and reporting',
      id: 'client-handover-and-reporting',
    },
    {
      type: 'p',
      text: "Clients do not trust an agent they do not understand. The person who can hand over a short guide (what the agent does, what it will not do, how to switch it to Suggestive mode, where to read conversations) keeps the account. Reporting matters too: a monthly note showing how many conversations the agent handled, how many it passed to a human, and which questions it struggled with turns AI from a feature into a service the client keeps paying for.",
    },
    {
      type: 'p',
      text: "Handover is also where compliance comes up. Rules on call recording consent, SMS marketing and disclosing that a customer is talking to AI vary by country and state. You are not expected to give legal advice, but you should flag the question and ask the client to confirm what applies to them before an agent goes live.",
    },
    {
      type: 'ul',
      items: [
        '**Proof:** a one-page client handover document and a sample monthly report template with real headings and placeholder numbers clearly marked as examples.',
        '**Practise this week:** write the handover guide for the agent you built, as if the client has never logged in to HighLevel.',
      ],
    },
    {
      type: 'h2',
      text: 'Putting these skills on your profile',
      id: 'putting-skills-on-your-profile',
    },
    {
      type: 'p',
      text: "Agencies skim. Lead with outcomes and artefacts, not tool names. Instead of listing \"Conversation AI, Voice AI, Agent Studio\", write one line per skill with a link to the proof: \"Built and tested a booking agent for a sample clinic: 20-question test sheet, knowledge base pack and handover guide.\" One complete example across all six skills is worth more than six half-finished ones.",
    },
    {
      type: 'callout',
      text: 'When you have one or two pieces of proof ready, browse [open GHL roles](/jobs) and look for listings that mention AI agents, automation or client success. Agencies hiring for these skills can [post a job](/post-job) on GHL Hire for free.',
    },
  ],
  faq: [
    {
      q: 'Do I need to know how to code to work on HighLevel AI agents?',
      a: "No. Conversation AI, Voice AI and Agent Studio are configured in HighLevel's interface. Coding helps for API calls and custom integrations, but most agency work is clear writing, good workflow design and careful testing.",
    },
    {
      q: 'What is the difference between Conversation AI and Agent Studio in HighLevel?',
      a: "Conversation AI is HighLevel's chat agent with set modes such as Suggestive and Autopilot. Agent Studio is a visual, node-based builder for custom agents with routers, knowledge search, API calls and data collection steps. Check HighLevel's help centre for the current details, as both change often.",
    },
    {
      q: 'How do I prove AI skills without client work to show?',
      a: 'Build a complete example for a made-up business in a test sub-account. Show the agent spec, knowledge base content, a test sheet with failures and fixes, and a handover document. That shows your process, which is what agencies are judging.',
    },
    {
      q: 'Which AI skill should I learn first as a GoHighLevel VA?',
      a: 'Start with testing and knowledge base writing. Both build on skills you likely already have (attention to detail and clear writing), and both are things agencies struggle to find.',
    },
  ],
  sources: [
    {
      label: 'HighLevel: Skills Platform for AI Agents',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000008315',
    },
    {
      label: 'HighLevel: Guide to Understanding Conversation AI Bot',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000001335-conversation-ai-bot-explained',
    },
    {
      label: 'HighLevel: Conversation AI Bot Training',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000008470-training-your-conversation-ai-bot',
    },
    {
      label: 'HighLevel: Knowledge Base Integration for Voice AI Agents',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000005266',
    },
    {
      label: 'HighLevel: Workflow Action, AI Agent',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000007600',
    },
    {
      label: 'HighLevel: Agent Studio Overview',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000007393',
    },
    {
      label: 'HighLevel: View and Edit AI Response Info in Conversations',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000004183-view-edit-ai-response-info-in-conversations',
    },
  ],
  relatedSearch: 'automation',
};

export default article;
