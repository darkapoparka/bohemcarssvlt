import { getPostBySlug, posts, type BlogPost } from '$lib/data/blog';
import { bohemcarsContact } from '$lib/data/bohemcars';

export type AuxeroBlogDetailContent = {
	emailPlaceholder: string;
	facebookHref: string;
	firstRelated: BlogPost;
	paragraphs: AuxeroBlogDetailParagraph[];
	post: BlogPost;
	related: BlogPost[];
	secondRelated: BlogPost;
};

export type AuxeroBlogDetailParagraph = {
	id: string;
	quoteBefore: boolean;
	text: string;
};

export const relatedBlogPosts = (post: BlogPost) =>
	posts.filter((item) => item.slug !== post.slug).slice(0, 3);

const articleParagraphs = (post: BlogPost): AuxeroBlogDetailParagraph[] =>
	post.content.map((text, index) => ({
		id: `${post.slug}-paragraph-${index + 1}`,
		quoteBefore: index === 1,
		text
	}));

export const auxeroBlogDetailForSlug = (slug: string): AuxeroBlogDetailContent | undefined => {
	const post = getPostBySlug(slug);

	if (!post) return undefined;

	const related = relatedBlogPosts(post);

	return {
		emailPlaceholder: bohemcarsContact.emailLabel,
		facebookHref: bohemcarsContact.facebookHref,
		firstRelated: related[0] ?? post,
		paragraphs: articleParagraphs(post),
		post,
		related,
		secondRelated: related[1] ?? post
	};
};
