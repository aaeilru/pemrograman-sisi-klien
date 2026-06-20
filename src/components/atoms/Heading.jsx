const Heading = ({ as: Tag = "h2", children, className = "" }) => {
  return <Tag className={className}>{children}</Tag>;
};

export default Heading;