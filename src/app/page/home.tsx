import React from "react";
import Counter from "../comp/counter";

interface HomeProps {
  items: Array<string>
}

const HomePage: React.FunctionComponent<HomeProps> = ({ items }) => (
  <div>
    <Counter />
  </div>
);

export default HomePage;
