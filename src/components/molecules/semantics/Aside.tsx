import { Container } from "@/components/atoms";

export const Aside: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <Container.Semantic as="aside" {...props} />
);
