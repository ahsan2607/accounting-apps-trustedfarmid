import { Container } from "@/components/atoms";

export const Nav: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <Container.Semantic as="nav" {...props} />
);
