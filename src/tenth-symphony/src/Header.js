import './styles/header.scss';


// BEM - Block Element Modifier
function Header() {
  return (
    <header className="w-100 flex align-center justify-center" style={{backgroundColor: 'green'}}>
      <h1>The Tenth Symphony</h1>
    </header>
  );
}

export default Header;
