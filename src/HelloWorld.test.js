const { render, screen } = require('@testing-library/react');
const HelloWorld = require('./HelloWorld');

test('renders Hello World text', () => {
    render(<HelloWorld />);
    const linkElement = screen.getByText(/Hello World/i);
    expect(linkElement).toBeInTheDocument();
});