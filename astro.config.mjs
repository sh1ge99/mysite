// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import remarkDirective from "remark-directive";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";

// カスタムディレクティブプラグイン
function remarkCustomDirectives() {
  return (/** @type {any} */ tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const data = node.data || (node.data = {});
        data.hName = "div";

        if (node.name === "message") {
          data.hProperties = {
            className: ["note-block", "note-block-info"],
          };
        }
      }
    });
  };
}

// OGPリンク変換プラグイン
function remarkOGPLinks() {
  return (/** @type {any} */ tree) => {
    visit(tree, (node) => {
      // 単独のパラグラフ内にURLのみが含まれている場合をOGPカードに変換
      if (
        node.type === 'paragraph' &&
        node.children &&
        node.children.length === 1 &&
        node.children[0].type === 'link'
      ) {
        const link = node.children[0];
        const url = link.url;
        
        // httpまたはhttpsで始まるURLのみを対象
        if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
          const data = node.data || (node.data = {});
          data.hName = 'div';
          data.hProperties = {
            className: ['ogp-link-container'],
            'data-url': url
          };
          
          // 子要素をクリア
          node.children = [];
        }
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkCustomDirectives, remarkOGPLinks],
    rehypePlugins: [rehypeRaw],
  },
});
