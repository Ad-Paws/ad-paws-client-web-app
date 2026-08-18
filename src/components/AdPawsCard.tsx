import React from "react";
import { Card } from "./ui/card";
import clsx from "clsx";

const AdPawsCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={clsx(
        "bg-card border-border shadow-card rounded-xl p-6 relative",
        className
      )}
    >
      {children}
    </Card>
  );
};

export default AdPawsCard;
