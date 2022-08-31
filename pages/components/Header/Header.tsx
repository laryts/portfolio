import React from 'react'
import { Container, Content, Logo, Menu } from './Header.styles'

function Header() {
  return (
    <Container>
      <Content>
        <Logo>Larissa Soares</Logo>
        <Menu>
          <ul>
            <li>home</li>
            <li>work</li>
            <li>contact</li>
          </ul>
        </Menu>
      </Content>
    </Container>
  )
}

export default Header
