import React, { LiHTMLAttributes } from "react";

interface CheckboxRendererProps {
  checked: boolean;
}
export const CheckboxRenderer: React.FC<CheckboxRendererProps> = ({
  checked,
}) => {
  return <input type="checkbox" checked={checked} readOnly />;
};

interface ListItemRendererProps extends LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode[];
}
export const ListItemRenderer: React.FC<ListItemRendererProps> = ({
  children,
}): LiHTMLAttributes<HTMLLIElement> => {
  // Ensure children[0] and children[0].props exist before accessing them
  if (
    React.isValidElement(children[0]) &&
    typeof children[0].props.children === "string"
  ) {
    // Regex to match markdown checkboxes ([ ] or [x])
    const checkboxMatch = children[0].props.children.match(/\[([ xX])\]/);

    if (checkboxMatch) {
      const isChecked = checkboxMatch[1].toLowerCase() === "x";
      return (
        <li>
          <CheckboxRenderer checked={isChecked} />
          {children[0].props.children.replace(/\[([ xX])\]/, "").trim()}
        </li>
      );
    }
  }

  return <li>{children}</li>;
};
