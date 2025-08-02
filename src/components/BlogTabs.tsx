import React, { useState, useMemo } from "react";

interface BlogPost {
  slug: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    tags?: string[];
  };
}

interface BlogTabsProps {
  posts: BlogPost[];
}

// Define categories - simple Dev/Self classification
const categories = [
  { id: "all", name: "All" },
  { id: "dev", name: "Dev" },
  { id: "self", name: "Self" },
];

const BlogTabs: React.FC<BlogTabsProps> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState("all");

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (activeCategory === "all") {
      return posts;
    }

    return posts.filter((post) => {
      if (!post.data.tags || post.data.tags.length === 0) {
        return false;
      }

      // Check for exact "Dev" or "Self" tag
      return post.data.tags.includes(activeCategory === "dev" ? "Dev" : "Self");
    });
  }, [posts, activeCategory]);

  return (
    <div className="space-y-8 w-full min-h-96">
      {/* Category Tabs */}
      <div className="flex space-x-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`
              text-lg font-medium transition-all duration-200 pb-1 border-b-2
              ${
                activeCategory === category.id
                  ? "text-gray-900 border-gray-900"
                  : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Post Count */}
      <div className="text-sm text-gray-500">
        {filteredPosts.length}件の記事
      </div>

      {/* Blog Posts */}
      <div className="divide-y divide-gray-100">
        {filteredPosts.map((post) => (
          <article key={post.slug} className="group">
            <a
              href={`/${post.slug}/`}
              className="block py-4 px-24 hover:bg-gray-50 transition-colors"
            >
              <time className="text-sm text-gray-500 mb-2 block">
                {post.data.pubDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <h2 className="text-lg font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                {post.data.title}
              </h2>
            </a>
          </article>
        ))}
      </div>

      {/* No Results */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            このカテゴリには記事がありません
          </h3>
          <p className="text-gray-600">他のカテゴリをお試しください。</p>
        </div>
      )}
    </div>
  );
};

export default BlogTabs;
