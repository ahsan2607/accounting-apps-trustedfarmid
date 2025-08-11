import { Container } from "@/components/atoms";

export const Main: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <Container.Semantic as="main" {...props} />
);
