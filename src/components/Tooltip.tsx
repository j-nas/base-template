import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

type Props = {
  children: React.ReactNode;
  content: string;
};

const TooltipDemo = ({ children, content }: Props) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-accent p-4 text-accent-content"
            side="top"
            sideOffset={5}
          >
            {content}
            <Tooltip.Arrow height={10} width={20} className="fill-accent" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default TooltipDemo;
