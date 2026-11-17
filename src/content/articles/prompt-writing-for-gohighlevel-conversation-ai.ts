import type { Article } from './types';

const article: Article = {
  slug: 'prompt-writing-for-gohighlevel-conversation-ai',
  title: 'How to write prompts for GoHighLevel Conversation AI bots',
  description:
    "A practical guide to writing GoHighLevel Conversation AI bot prompts: prompt anatomy, a worked example, common failures and fixes, test messages, a change log.",
  category: 'AI Skills',
  publishedAt: '2026-11-13',
  readingMinutes: 6,
  cover: '/articles/prompt-writing-for-gohighlevel-conversation-ai.jpg',
  coverAlt:
    'Abstract illustration of stacked chat bubbles connected by thin lines to a calendar grid and a small checklist, in soft blue and gray tones.',
  keyTakeaways: [
    'A Conversation AI bot gets its behaviour from three places: the prompt, the knowledge base, and the actions you switch on, so each job belongs in the right one.',
    'A good bot prompt states the role, the business facts that never change, one main goal, the tone, hard rules, what to do when unsure, and when to hand over to a person.',
    'Most bad bot behaviour (made-up prices, skipped bookings, endless loops) traces back to a missing rule or a fact that lives in the wrong place.',
    'Test every change with the same set of real messages and record it in a change log, so you can explain and undo what you did.',
  ],
  body: [
    {
      type: 'p',
      text: "Writing prompts for GoHighLevel Conversation AI bots is now a paid skill in its own right. Agencies hire people to build these bots, and clients notice quickly when one invents a price or refuses to book a call. This guide covers how the bot actually receives its instructions in HighLevel, how to structure a prompt, a full worked example, the failures you will see most often, and a testing routine you can reuse on every client account.",
    },
    {
      type: 'h2',
      text: 'Where a Conversation AI bot gets its instructions',
      id: 'where-the-bot-gets-instructions',
    },
    {
      type: 'p',
      text: "HighLevel's help centre describes three ways to build a bot: a guided form, a **Prompt Based Bot** where you write the instructions yourself, and a **Flow Based Builder** for visual, branching conversations. Whichever you pick, the bot's behaviour comes from three separate places, and knowing which is which saves hours of debugging.",
    },
    {
      type: 'ul',
      items: [
        "**The prompt and instructions.** Personality, intent, tone and rules. HighLevel's docs also mention fields such as Additional Instructions and Brand Voice for tone and do or don't guidance.",
        "**Training sources.** Under AI Agents, a Knowledge Base can hold Web Crawler pages, FAQs, Rich Text, Tables, file uploads and web search. A knowledge base only helps the bot once it is attached to that bot.",
        "**Actions (Bot Goals).** Appointment Booking, Trigger Workflow, Contact Info, Human Handover, Stop Bot, Auto Followup and Transfer Bot. These are what the bot can do, not just say.",
      ],
    },
    {
      type: 'p',
      text: "The bot also has response modes: Off, Suggestive (it drafts replies for your team to approve) and Auto-Pilot (it replies on its own). It can work across channels such as SMS, email, Facebook, Instagram, WhatsApp and the chat widget. Feature names and availability change and can vary by account, so check the current help article before you promise a client a specific option.",
    },
    {
      type: 'callout',
      title: 'The placement rule',
      text: "Put stable facts in the knowledge base, behaviour in the prompt, and anything that touches a calendar or a workflow in actions. HighLevel's own Bot Goals article warns against putting calendar slots in the prompt, because availability should come from the booking settings.",
    },
    {
      type: 'h2',
      text: 'The anatomy of a good bot prompt',
      id: 'anatomy-of-a-bot-prompt',
    },
    {
      type: 'p',
      text: 'Write the prompt in short labelled sections. The model reads it top to bottom on every reply, so clear headings make each rule easy to find when you edit it later. Use these seven parts:',
    },
    {
      type: 'ol',
      items: [
        "**Role.** Who the bot is and who it talks to. One or two sentences.",
        "**Business facts.** Name, location, hours, service area, the services offered. Only facts that rarely change; longer detail goes in the knowledge base.",
        "**Goal.** One primary outcome, such as booking a free estimate. If you list five goals, the bot will chase none of them.",
        "**Tone.** Reading level, message length, whether to use the contact's first name. Give a word limit, for example under 60 words per reply.",
        "**Rules.** Hard limits written as plain instructions: never quote a price that is not in the knowledge base, ask one question at a time, never promise a same-day visit.",
        "**When unsure.** Exactly what to say when the answer is not in its sources, for example offering to have a team member follow up.",
        "**Handoff.** The situations where a person takes over: complaints, emergencies, billing disputes, or a direct request for a human.",
      ],
    },
    {
      type: 'h2',
      text: 'A worked example for a local business',
      id: 'worked-example',
    },
    {
      type: 'p',
      text: "The business below is **fictional**, invented for this example. Northgate Plumbing is a two-van plumbing company. The bot's job is to book free estimates for non-urgent work, and to pass emergencies to a person. Here is the prompt, section by section:",
    },
    {
      type: 'ul',
      items: [
        "**Role:** You are the text assistant for Northgate Plumbing. You reply to people who message us about plumbing work.",
        "**Business facts:** We serve homes within 25 km of our office. Office hours are Monday to Friday, 8am to 5pm. We do repairs, water heater installs and bathroom refits. We do not do commercial work or septic systems.",
        "**Goal:** Book a free estimate using the booking action. Before booking, collect the job type and the address suburb.",
        "**Tone:** Friendly and plain. Under 50 words per reply. One question per message. Use the first name if you have it.",
        "**Rules:** Never quote a price or a price range. If asked about cost, explain that the plumber confirms the price at the free estimate. Never offer a time that the calendar does not show.",
        "**When unsure:** Say you will check with the team, then use the handover action. Do not guess.",
        "**Handoff:** Hand over at once if the person mentions flooding, a burst pipe, gas, a complaint, or asks for a person.",
      ],
    },
    {
      type: 'p',
      text: "Pair the prompt with a knowledge base that holds the service list and FAQs, an Appointment Booking action pointed at the estimates calendar, and a Human Handover action. HighLevel's handover action can assign the conversation, send a closing message, pause the bot, create a task and add a tag, and its help article notes it is released through Labs, so it may need switching on first.",
    },
    {
      type: 'h2',
      text: 'Common failure modes and how to fix them',
      id: 'failure-modes-and-fixes',
    },
    {
      type: 'table',
      head: ['Symptom', 'Likely cause', 'Fix'],
      rows: [
        ['Invents prices', 'No price rule, or vague pages crawled', 'Add a no-price rule and a fixed reply for cost questions'],
        ['Ignores booking', 'Booking action off or goal unclear', 'Turn on the action and make booking the one goal'],
        ['Talks too much', 'No length limit', 'Set a word limit and one question per reply'],
        ['Loops on a question', 'No exit after repeated failure', 'After two failed tries, hand over'],
        ['Answers out of scope', 'No list of what you do not do', 'List excluded services and the reply to give'],
      ],
    },
    {
      type: 'p',
      text: "Two more causes are worth checking before you rewrite anything. First, look at what the web crawler actually picked up: HighLevel lets you review and edit crawled website content, and an old pricing page is a common source of invented numbers (note that a re-crawl can overwrite manual edits). Second, check for rules that contradict each other, such as \"always book a call\" next to \"hand over anyone who asks about price\". The bot may follow either one, and you cannot predict which.",
    },
    {
      type: 'h2',
      text: 'A testing checklist with real test messages',
      id: 'testing-checklist',
    },
    {
      type: 'p',
      text: "Test before you leave Off or Suggestive mode. HighLevel provides a test panel in the bot editor, and Suggestive mode is a sensible second stage because your team approves every reply. Send the same messages every time, so results are comparable across versions:",
    },
    {
      type: 'ol',
      items: [
        '"How much do you charge to fix a leaking tap?" (should not quote a price)',
        '"Can someone come out Saturday?" (should only offer slots the calendar allows)',
        '"Hi" (should greet briefly and move toward the goal)',
        '"Do you fix septic tanks?" (should say no politely, using the excluded list)',
        '"Water is pouring through my ceiling" (should hand over at once)',
        '"Can I talk to a real person" (should hand over)',
        '"I want to book, my suburb is Riverside" followed by a booking (should complete the booking action)',
        '"What is your opinion on the election?" (should steer back to plumbing)',
        'Three unclear replies in a row, such as "maybe", "not sure", "dunno" (should not loop forever)',
      ],
    },
    {
      type: 'p',
      text: "After launch, read real conversations weekly. HighLevel's docs point to a Conversation AI dashboard and agent logs for reviewing what the bot did. Also check local rules: AI disclosure and SMS consent rules vary by country and state, so confirm what applies before a bot texts anyone on Auto-Pilot.",
    },
    {
      type: 'h2',
      text: 'Keep a change log for every bot',
      id: 'keep-a-change-log',
    },
    {
      type: 'p',
      text: "Prompts drift. A client asks for a small tweak, someone edits the knowledge base, and a month later nobody knows why the bot started quoting prices. A simple change log fixes this, and it doubles as proof of your work when the client asks what they are paying for.",
    },
    {
      type: 'ul',
      items: [
        '**Date and version number**, for example v1.4.',
        '**What changed**, quoted exactly: the old line and the new line.',
        '**Why**, with the conversation or complaint that prompted it.',
        '**Test result**, which of your standard test messages passed or failed.',
        '**Who approved it** on the client side, if anyone.',
      ],
    },
    {
      type: 'p',
      text: "Keep the full current prompt in the same document, so you can paste back an older version in under a minute. Change one thing at a time; if you change three rules and the bot improves, you will not know which rule did it.",
    },
    {
      type: 'callout',
      title: 'Turn this into work',
      text: "A tested prompt, a clean knowledge base and a change log make a strong portfolio piece. Agencies hiring for this skill post on the board, so browse [open GHL roles](/jobs) and look for Conversation AI or automation in the title.",
    },
  ],
  faq: [
    {
      q: 'Should I use the Prompt Based Bot or the Flow Based Builder in GoHighLevel?',
      a: "Use the prompt-based option when conversations are open-ended, such as answering questions and booking. Use the flow builder when you need a fixed sequence of questions and branches. Many builders start with a prompt-based bot and only move to flows when they need strict control.",
    },
    {
      q: 'Why does my Conversation AI bot make up prices?',
      a: "Usually because the prompt has no rule against it, or the crawled website includes old or vague pricing. Add an explicit no-price rule with a fixed reply for cost questions, then review the crawled content in the knowledge base and remove anything outdated.",
    },
    {
      q: 'How long should a Conversation AI prompt be?',
      a: "Long enough to cover role, facts, goal, tone, rules, uncertainty and handoff, which for most local businesses fits on one page. Move long lists, such as full service menus and FAQs, into the knowledge base instead of the prompt.",
    },
    {
      q: 'Can the bot hand a conversation to a human?',
      a: "Yes. HighLevel has a Human Handover action that can trigger when a contact asks for a person, when the bot lacks information, or after failed attempts to resolve an issue. Its help article says it is released through Labs, so you may need to enable it first.",
    },
  ],
  sources: [
    {
      label: 'HighLevel Help: How to Create and Set Up a Conversation AI Bot',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000004401-setting-up-conversation-ai',
    },
    {
      label: 'HighLevel Help: Guide to Understanding Conversation AI Bot',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000001335-conversation-ai-bot-explained',
    },
    {
      label: 'HighLevel Help: Bot Goals Overview in Conversation AI',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000004417-bot-goals-overview-conversation-ai',
    },
    {
      label: 'HighLevel Help: Knowledge Base Overview',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000007313-knowledge-base-overview',
    },
    {
      label: "HighLevel Help: Human Handover Action in Conversation AI",
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000005615-conversation-ai-human-handover-action',
    },
    {
      label: 'HighLevel Help: Review and Edit Website Content Used by Conversation AI',
      url: 'https://help.gohighlevel.com/support/solutions/articles/155000003215-review-and-edit-website-content-used-by-conversation-ai',
    },
  ],
  relatedSearch: 'automation',
};

export default article;
