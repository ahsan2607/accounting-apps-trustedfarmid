import { Container } from "@/components/atoms";

export const Header: React.FC<React.HTMLAttributes<HTMLElement>> = (props) => (
  <Container.Semantic as="header" {...props} />
);
