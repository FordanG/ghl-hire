import type { Article } from './types';

const article: Article = {
  slug: 'gohighlevel-va-to-ai-automation-specialist',
  title: 'From GoHighLevel VA to AI automation specialist in 90 days',
  description:
    'A 90-day plan for a GoHighLevel VA to move into AI automation work: master workflows, add AI steps, build two portfolio projects, then reposition for new roles.',
  category: 'Career Moves',
  publishedAt: '2026-11-10',
  readingMinutes: 6,
  cover: '/articles/gohighlevel-va-to-ai-automation-specialist.jpg',
  coverAlt:
    'Abstract illustration of a winding path made of connected workflow nodes rising across three stepped blocks, in blue and soft gray.',
  keyTakeaways: [
    'Moving from GoHighLevel VA to AI automation specialist is mostly about depth in workflows, not about collecting AI tools.',
    'Spend month one on triggers, conditions, waits, custom fields and webhooks, month two on AI steps and one outside tool, and month three on repositioning.',
    'Two documented portfolio projects with a clear before and after will do more for you than a long list of skills on a profile.',
    'A real automation job post describes systems and outcomes; a VA post in disguise lists daily admin tasks.',
  ],
  body: [
    {
      type: 'p',
      text: "Many GoHighLevel VAs already touch automation every day: fixing a workflow that stopped sending, cloning a snapshot, adding a tag. The move from GoHighLevel VA to AI automation specialist is about owning that work instead of assisting with it. This 90-day plan assumes you work part time on it, around five to eight hours a week, alongside your current clients.",
    },
    {
      type: 'h2',
      text: 'What actually changes when you move up',
      id: 'what-changes',
    },
    {
      type: 'p',
      text: "A VA is usually measured on tasks completed. An automation specialist is measured on systems that keep working without them: leads followed up, appointments confirmed, data landing in the right field. Clients pay more for the second because a mistake costs them leads, so they want someone who can design, test and explain a build. That is the skill set this plan builds.",
    },
    {
      type: 'h2',
      text: 'Month 1: master workflows properly',
      id: 'month-1-workflows',
    },
    {
      type: 'p',
      text: "Set up a practice sub-account you can break freely. Then work through each building block until you can explain it without looking it up:",
    },
    {
      type: 'ul',
      items: [
        "**Triggers.** Know which event starts the workflow and what happens if it fires twice. Build at least five workflows with different triggers.",
        "**Conditions.** The If/Else action lets you branch on contact data and earlier step outputs. HighLevel's help docs note that an empty value does not stop the workflow, so test the empty case on purpose.",
        "**Wait steps.** The Wait action has several types, including a set period of time, waiting for the contact to reply, waiting for an upcoming appointment, and waiting until specific conditions are met. Build one of each.",
        "**Custom fields and custom values.** Custom fields hold data that differs per contact; custom values hold reusable information such as a support email or office hours. Mixing these up is one of the most common sources of broken builds.",
        "**Webhooks.** Learn the Inbound Webhook trigger (data comes in) and the outbound webhook actions (data goes out). Send a sample request from a free tool and map the fields. Check the client's plan, because HighLevel's help centre refers to the inbound webhook as a premium trigger.",
        "**Testing.** Use the test option on a draft workflow with a sample contact, then read the execution history. Write down what you expected and what happened.",
      ],
    },
    {
      type: 'callout',
      title: 'End of month 1 test',
      text: "Rebuild a lead follow-up from scratch: form submission, tag, SMS, wait for reply, branch on reply, notify the owner if no reply in two days. If you can build and test it in an afternoon, you are ready for month 2.",
    },
    {
      type: 'h2',
      text: 'Month 2: add AI steps and one outside tool',
      id: 'month-2-ai-and-portfolio',
    },
    {
      type: 'p',
      text: "HighLevel workflows include AI actions. The help centre documents a **GPT powered by OpenAI** action, where you write a prompt (which can include contact data and custom values) and use the response in later steps, for example saving it to a custom field or putting it into an email. There are also separate actions such as AI Summarize, AI Translate, AI Intent Detection and AI Decision Maker. AI actions can add usage costs, so check the pricing in the client's account before you build anything that runs on every contact.",
    },
    {
      type: 'p',
      text: "Then pick **one** outside automation tool and learn it well enough to connect it to HighLevel by webhook. Make and n8n both offer free official training (links below). Choose based on the job posts you want to apply to, not on which one is trending.",
    },
    {
      type: 'p',
      text: 'Build two portfolio projects in your practice account. Ideas that map to real client requests:',
    },
    {
      type: 'ol',
      items: [
        "**Lead triage.** A form submission runs through an AI step that classifies the enquiry, writes the result to a custom field, and an If/Else branch routes urgent leads to the owner by SMS.",
        "**Outside-in sync.** A Make or n8n scenario sends a new booking from another app into HighLevel through an inbound webhook, creates or updates the contact, and starts a confirmation sequence.",
      ],
    },
    {
      type: 'p',
      text: "For each project, record a short screen video, write one page covering the problem, the build and how you tested it, and take screenshots of the workflow. The landing page is not the point, so do not spend a week on it: reuse one of your own pages, or copy a funnel page into your builder with [Super Cloner](https://supercloner.app/?ref=3nojbk) and edit it.",
    },
    {
      type: 'h2',
      text: 'Month 3: reposition yourself',
      id: 'month-3-reposition',
    },
    {
      type: 'ul',
      items: [
        "**Profile.** Change your headline from VA to something specific, such as GoHighLevel automation specialist. Put the two projects at the top, with the video links.",
        "**Job titles to search for.** GoHighLevel automation specialist, GHL workflow builder, CRM automation specialist, marketing automation specialist, AI automation specialist, and Conversation AI builder.",
        "**How to talk about results.** Describe what the system does and what you checked, not adjectives. For example: built a reply-based follow-up that branches on the lead's answer and alerts the owner after 48 hours of silence, tested with ten sample contacts. Only quote numbers you measured and the client agrees you can share.",
        "**Ask a current client for wider scope.** Pick one manual task you do each week and propose automating it. Send a short note: what you do now, what the workflow would do, how you would test it, and a fixed price or extra hours for the build. A small paid build for an existing client is the easiest first step up.",
      ],
    },
    {
      type: 'h2',
      text: 'A weekly study plan',
      id: 'weekly-study-plan',
    },
    {
      type: 'table',
      head: ['Week', 'Focus', 'Output'],
      rows: [
        ['1', 'Triggers', 'Five small workflows'],
        ['2', 'If/Else', 'Branch on a custom field'],
        ['3', 'Wait steps', 'One of each wait type'],
        ['4', 'Fields, values, webhooks', 'Lead follow-up rebuild'],
        ['5', 'GPT action', 'AI step saving to a field'],
        ['6', 'Other AI actions', 'Summarize and intent test'],
        ['7', 'Make or n8n basics', 'First course finished'],
        ['8', 'Webhook to HighLevel', 'Portfolio project 1'],
        ['9', 'Testing and docs', 'Portfolio project 2'],
        ['10', 'Profile', 'New headline and videos'],
        ['11', 'Client pitch', 'Scope proposal sent'],
        ['12', 'Applications', 'Ten targeted applications'],
      ],
    },
    {
      type: 'p',
      text: 'Free learning sources, all checked for this guide:',
    },
    {
      type: 'ul',
      items: [
        "[HighLevel Help Center](https://help.gohighlevel.com), the official documentation for every trigger and action named above.",
        "[HighLevel Academy](https://www.gohighlevel.com/academy), HighLevel's learning hub with free on-demand courses, workshops and live events. Certification is a separate program.",
        "[Make Academy](https://academy.make.com/), free self-paced courses; you need a Make account, and a free one works.",
        "[n8n Academy](https://learn.n8n.io), whose courses n8n describes as free for everyone, starting with a quickstart course.",
      ],
    },
    {
      type: 'h2',
      text: 'What to stop doing',
      id: 'what-to-stop-doing',
    },
    {
      type: 'ul',
      items: [
        "**Stop learning five tools at once.** One CRM and one outside tool, learned properly, beats a profile full of logos.",
        "**Stop building in live client accounts first.** Test in your practice account, then copy across.",
        "**Stop billing builds as admin hours.** Price automation work as a separate project so the client sees it as a different service.",
        "**Stop saying yes to every task.** If most of your week is inbox and calendar admin, block time for the plan or it will not happen.",
        "**Stop shipping without notes.** Every build gets a short document: trigger, steps, fields used, how to test.",
      ],
    },
    {
      type: 'h2',
      text: 'How to tell if a job post is a real automation role',
      id: 'read-a-job-post',
    },
    {
      type: 'p',
      text: "Many posts use the word automation for what is really general VA work. Read the responsibilities before the title.",
    },
    {
      type: 'ul',
      items: [
        "**Real automation signals:** building and maintaining workflows, webhooks or API work, integrations with named tools, Conversation AI or Voice AI setup, snapshot building, documentation and testing, ownership of a pipeline or system.",
        "**VA signals:** inbox management, calendar booking, social posting, data entry as the main duty, many unrelated tasks across different tools.",
        "**Questions to ask:** Who designs the workflows? Who tests them? Will I have admin access to a sub-account? What does success look like in 90 days?",
      ],
    },
    {
      type: 'callout',
      text: "Browse [open GHL roles](/jobs) and save five posts that match the automation signals. Use their responsibilities as your checklist for months two and three.",
    },
  ],
  faq: [
    {
      q: 'Do I need to know how to code to become a GoHighLevel automation specialist?',
      a: "No, most of the work happens in HighLevel's visual workflow builder and no-code tools such as Make or n8n. You do need to understand data: fields, webhooks and JSON payloads. Basic reading of JSON is worth learning in month one.",
    },
    {
      q: 'Should I learn Make, n8n or Zapier?',
      a: "Pick the one that appears most in the job posts you want. Make and n8n both have free official academies. Learn one well enough to connect it to HighLevel by webhook before touching a second.",
    },
    {
      q: 'Is HighLevel certification required to get automation work?',
      a: "Not usually; clients mostly ask to see working builds. HighLevel offers a paid certification program separate from its free Academy courses, which some people use to add credibility, but two documented portfolio projects are the stronger proof.",
    },
    {
      q: 'How do I ask my current client for automation work?',
      a: "Pick one repetitive task you already do, and send a short proposal showing what the workflow would do, how you would test it and what it costs. Starting with a small, fixed-scope build makes it easy for the client to say yes.",
    },
  ],
  sources: [
    {
      label: 'HighLevel Help: If/Else workflow action',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000002471-workflow-action-if-else',
    },
    {
      label: 'HighLevel Help: Workflow Wait action',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000002470-workflow-action-wait',
    },
    {
      label: 'HighLevel Help: How to use Custom Values',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000008770-how-to-use-custom-values',
    },
    {
      label: 'HighLevel Help: Workflow Trigger, Inbound Webhook',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000003147-workflow-trigger-inbound-webhook',
    },
    {
      label: 'HighLevel Help: Custom Webhook workflow action',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000003305-workflow-action-custom-webhook',
    },
    {
      label: 'HighLevel Help: GPT powered by OpenAI workflow action',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000000209-workflow-action-gpt-powered-by-openai',
    },
    {
      label: 'HighLevel blog: Introducing HighLevel Academy',
      url: 'https://www.gohighlevel.com/post/introducing-highlevel-academy',
    },
    {
      label: 'Make blog: Learn automation with Make Academy',
      url: 'https://www.make.com/en/blog/learn-automation-make-academy',
    },
    {
      label: 'n8n Education',
      url: 'https://n8n.io/education/',
    },
  ],
  relatedSearch: 'virtual assistant',
};

export default article;
