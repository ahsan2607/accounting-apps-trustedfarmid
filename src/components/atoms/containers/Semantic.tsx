import React from "react";

type SemanticTag = "header" | "main" | "section" | "article" | "aside" | "footer" | "nav";

export type SemanticProps<T extends SemanticTag> = React.HTMLAttributes<HTMLElement> & {
  as?: T;
};

export const Semantic = <T extends SemanticTag = "section">({ as, children, className, ...rest }: SemanticProps<T>) => {
  const Tag = as || "section";
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  );
};

export const Main: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="main" {...props} />;

export const Section: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="section" {...props} />;

export const Article: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="article" {...props} />;

export const Aside: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="aside" {...props} />;

export const Footer: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="footer" {...props} />;

export const Nav: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => <Semantic as="nav" {...props} />;
