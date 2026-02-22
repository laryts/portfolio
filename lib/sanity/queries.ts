export const blogPostsByLangQuery = `*[_type == "post" && language == $lang] | order(coalesce(publishedAt, _createdAt) desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  tags,
  language,
  publishedAt,
  _createdAt,
  featured,
  mainImage
}`

export const blogPostBySlugQuery = `*[_type == "post" && slug.current == $slug && language == $lang][0] {
  _id,
  title,
  "slug": slug.current,
  summary,
  body,
  mainImage,
  tags,
  language,
  publishedAt,
  featured
}`

export const featuredBlogPostsQuery = `*[_type == "post" && language == $lang && featured == true] | order(coalesce(publishedAt, _createdAt) desc) [0...$limit] {
  _id,
  title,
  "slug": slug.current,
  summary,
  tags,
  language,
  publishedAt,
  _createdAt,
  featured,
  mainImage
}`

export const blogSlugsByLangQuery = `*[_type == "post" && language == $lang].slug.current`
