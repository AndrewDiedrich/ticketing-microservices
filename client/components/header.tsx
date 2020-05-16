import Link from 'next/link';

interface ILinkTypes {
  label: string;
  href: string;
}

export default ({ currentUser }: any) => {
  let links = [] as Array<ILinkTypes>;
  links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    // @ts-ignore
    .filter((linkConfig: ILinkTypes) => linkConfig)
    .map(({ label, href }: ILinkTypes) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand" href="">
          GitTix
        </a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-cents">{links}</ul>
      </div>
    </nav>
  );
};