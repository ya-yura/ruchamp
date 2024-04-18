import { cn } from '@/lib/utils';

export function ArrowIcon() {
  return (
    <svg
      fill="currentColor"
      className=""
      aria-hidden="true"
      width="1em"
      height="1em"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 0 1-.78 0L4.15 8.35a.5.5 0 1 1 .7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0Z"
        fill="currentColor"
      ></path>
    </svg>
  );
}

export function AppsIcon({ className }: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn('', className)}
        d="M19 15.0107L22.9894 19H19V15.0107ZM24.2448 1.24541L19 6.4902V6.25004C19 3.90282 17.0972 2.00004 14.75 2.00004H4.25C1.90279 2.00004 0 3.90282 0 6.25003V33.75C0 36.0972 1.90279 38 4.25 38H31.75C34.0972 38 36 36.0972 36 33.75V23.25C36 20.9028 34.0972 19 31.75 19H31.5106L36.755 13.7556C38.4148 12.0959 38.4148 9.40496 36.755 7.74523L30.2552 1.24541C28.5955 -0.414322 25.9045 -0.414321 24.2448 1.24541ZM27.2938 21.5H31.75C32.7165 21.5 33.5 22.2835 33.5 23.25V33.75C33.5 34.7165 32.7165 35.5 31.75 35.5H19V21.5H27.2062C27.2354 21.5003 27.2646 21.5003 27.2938 21.5ZM4.25 4.50004H14.75C15.7165 4.50004 16.5 5.28354 16.5 6.25004V19H2.5V6.25003C2.5 5.28354 3.2835 4.50004 4.25 4.50004ZM16.5 21.5V35.5H4.25C3.2835 35.5 2.5 34.7165 2.5 33.75V21.5H16.5Z"
        fill="#0F6CBD"
      />
    </svg>
  );
}

export function ChannelShareIcon({
  className,
}: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn('', className)}
        d="M6.475 0C2.89896 0 0 2.89896 0 6.475V18.525C0 22.101 2.89896 25 6.475 25H18.207C18.86 27.3085 20.9824 29 23.5 29C26.5376 29 29 26.5376 29 23.5C29 20.4624 26.5376 18 23.5 18C20.8039 18 18.5609 19.9399 18.0907 22.5H6.475C4.27967 22.5 2.5 20.7203 2.5 18.525V6.475C2.5 4.27967 4.27967 2.5 6.475 2.5H18.525C20.7203 2.5 22.5 4.27967 22.5 6.475V6.75C22.5 7.44036 23.0596 8 23.75 8C24.4404 8 25 7.44036 25 6.75V6.475C25 2.89896 22.101 0 18.525 0H6.475ZM11 29.75V29.25C11 28.5596 11.5596 28 12.25 28C12.9404 28 13.5 28.5596 13.5 29.25V29.75C13.5 31.8211 15.1789 33.5 17.25 33.5H29.75C31.8211 33.5 33.5 31.8211 33.5 29.75V17.25C33.5 15.1789 31.8211 13.5 29.75 13.5H17.9093C17.4391 16.0601 15.1961 18 12.5 18C9.46243 18 7 15.5376 7 12.5C7 9.46243 9.46243 7 12.5 7C15.0176 7 17.14 8.69149 17.793 11H29.75C33.2018 11 36 13.7982 36 17.25V29.75C36 33.2018 33.2018 36 29.75 36H17.25C13.7982 36 11 33.2018 11 29.75Z"
        fill="#0F6CBD"
      />
    </svg>
  );
}

export function DocumentLightningIcon({
  className,
}: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="38"
      height="42"
      viewBox="0 0 38 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn('', className)}
        d="M22 0V11.25C22 13.3211 23.6789 15 25.75 15H38V36C38 37.6569 36.6569 39 35 39H12.8246L19.1314 31.8076C21.0236 29.6497 19.6493 26.3246 16.9074 26.0222L18.905 22.4708C20.0299 20.471 18.5848 18 16.2903 18H6.63552C6.41906 18 6.20624 18.0233 6 18.068V3C6 1.34315 7.34315 0 9 0H22ZM24.5 0.464286V11.25C24.5 11.9404 25.0596 12.5 25.75 12.5H37.4615L24.5 0.464286ZM6.63507 20H16.2899C17.0547 20 17.5364 20.8237 17.1614 21.4903L13.4997 28H16.4994C17.7889 28 18.4774 29.5194 17.6272 30.489L7.97187 41.5001C6.96231 42.6514 5.087 41.67 5.45752 40.1842L6.99972 34H1.00364C0.27109 34 -0.21284 33.2383 0.0983705 32.5752L5.7298 20.5752C5.89453 20.2242 6.24732 20 6.63507 20Z"
        fill="#0F6CBD"
      />
    </svg>
  );
}

export function MoleculeIcon({ className }: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="38"
      height="40"
      viewBox="0 0 38 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn('', className)}
        d="M28 20C33.5228 20 38 15.5228 38 10C38 4.47715 33.5228 0 28 0C22.4772 0 18 4.47715 18 10C18 11.9023 18.5312 13.6806 19.4533 15.1945L14.0659 18.784C12.5988 17.0794 10.4254 16 8 16C3.58172 16 0 19.5817 0 24C0 28.4183 3.58172 32 8 32C10.6832 32 13.0579 30.679 14.5092 28.6519L22.191 32.4922C22.0663 32.974 22 33.4793 22 34C22 37.3137 24.6863 40 28 40C31.3137 40 34 37.3137 34 34C34 30.6863 31.3137 28 28 28C26.1021 28 24.4099 28.8812 23.3105 30.2569L15.6286 26.4165C15.8699 25.6541 16 24.8422 16 24C16 22.9051 15.78 21.8616 15.3819 20.9112L21.0162 17.1573C22.8186 18.9162 25.2827 20 28 20Z"
        fill="#0F6CBD"
      />
    </svg>
  );
}

export function OrganizationsIcon({
  className,
}: React.HTMLAttributes<SVGElement>) {
  return (
    <svg
      width="38"
      height="40"
      viewBox="0 0 38 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        className={cn('', className)}
        d="M11.4971 7.50109C11.4971 3.35835 14.8554 0 18.9982 0C23.1409 0 26.4993 3.35835 26.4993 7.50109C26.4993 11.2179 23.796 14.3033 20.2482 14.8985V18.9999H27.7475C29.8185 18.9999 31.4973 20.6787 31.4973 22.7497V25.1012C35.046 25.6955 37.7502 28.7814 37.7502 32.4989C37.7502 36.6416 34.3919 40 30.2491 40C26.1064 40 22.748 36.6416 22.748 32.4989C22.748 28.7827 25.4505 25.6977 28.9973 25.1018V22.7497C28.9973 22.0594 28.4378 21.4999 27.7475 21.4999H10.249C9.55881 21.4999 8.99927 22.0594 8.99927 22.7497V25.1012C12.5479 25.6955 15.2522 28.7814 15.2522 32.4989C15.2522 36.6416 11.8938 40 7.75109 40C3.60835 40 0.25 36.6416 0.25 32.4989C0.25 28.7827 2.95242 25.6977 6.49927 25.1018V22.7497C6.49927 20.6787 8.1781 18.9999 10.249 18.9999H17.7482V14.8985C14.2005 14.3034 11.4971 11.218 11.4971 7.50109Z"
        fill="#0F6CBD"
      />
    </svg>
  );
}
