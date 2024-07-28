import { TermsProps } from "@/types";
import Link from 'next/link';

const Terms = ({ children, linkText, linkHref }: TermsProps) => (
  <p className="text-xs text-gray-500 dark:text-gray-400">
    {children}{" "}
    <Link href={linkHref} className="underline underline-offset-2">
      {linkText}
    </Link>
    .
  </p>
);

export default Terms;
