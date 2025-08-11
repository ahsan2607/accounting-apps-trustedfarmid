import { Container } from "@/components/atoms";

export const Section: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <Container.Semantic as="section" {...props} />
);
