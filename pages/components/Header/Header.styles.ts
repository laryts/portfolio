import styled from 'styled-components'

const Container = styled.div`
  max-width: 80%;
  margin: 0 auto;
`

const Content = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.div``

const Menu = styled.nav`
  ul {
    display: flex;
    flex-direction: row;
    list-style: none;
    li {
      padding: 0 16px;
    }
  }
`

export { Container, Content, Logo, Menu }
