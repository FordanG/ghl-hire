import type { Article } from './types';
import aiSkills from './ai-skills-gohighlevel-agencies-hire-for';
import aiProof from './ai-proof-your-gohighlevel-career';
import voiceAi from './become-a-voice-ai-specialist-gohighlevel';
import portfolio from './ai-portfolio-projects-for-gohighlevel-jobs';
import hiring from './hiring-ai-talent-for-your-gohighlevel-agency';
import services from './ai-services-gohighlevel-freelancers-can-sell';
import prompts from './prompt-writing-for-gohighlevel-conversation-ai';
import vaPath from './gohighlevel-va-to-ai-automation-specialist';

export type { Article, ArticleBlock, ArticleCategory } from './types';

/** Newest first. */
export const articles: Article[] = [
  aiSkills, aiProof, voiceAi, portfolio, hiring, services, prompts, vaPath,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  });
}
