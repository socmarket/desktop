import React from "react";

interface HomeProps {
  items: Array<string>
}

const HomePage: React.FunctionComponent<HomeProps> = ({ items }) => (
  <div>
    <strong>Hello, strongly</strong>
  </div>
);

export default HomePage;
