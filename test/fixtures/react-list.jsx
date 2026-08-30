export const List = ({ items }) => (
  <>
    {items.map((item, index) => (
      <div key={index}>{item}</div>
    ))}
  </>
);
