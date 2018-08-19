import React from 'react'
import styled from 'styled-components'
import Link from 'gatsby-link'


const SideBarWrapper = styled.aside`
  width: 30%;
  height: 100%;
  padding: 50px 0 0 0;
  display: flex;
  flex-direction: column;
`

const RecentPanel = styled.div`
  width: 100%;
  min-height: 100px;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  border: 1px solid #e5e5e5;
  border-radius: 6px;
`

const CategoryPanel = styled.div`
  margin-top: 20px;
  width: 100%;
  min-height: 100px;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  border: 1px solid #e5e5e5;
  border-radius: 6px;
`
const ContactPanel = styled.div`
  margin-top: 20px;
  margin-bottom: 30px;
  width: 100%;
  min-height: 100px;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
  border: 1px solid #e5e5e5;
  border-radius: 6px;
`
const PanelTitle = styled.h3`
  margin: 0;
  padding: 26px 0 13px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #eee;
`
const ListWrapper = styled.ul`
  margin: 0;
  box-sizing: border-box;
`
const List = styled.li`
  list-style-type: none;
  border-bottom: 1px solid #eee;
  min-height: 42px;
  margin: 0;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  &::before {
    display: ${props => props.selected ? 'block' : 'none'};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    content: "";
    background-color: #e36209;
  }
  &:hover {
    text-decoration: none;
    background-color: #f6f8fa;
  }
`

const ContactList = List.extend`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ContactLink = styled.a`
  cursor: pointer;
  color: rgba(0, 0, 0, 0.8);
  &:hover {
    color: #327fc7;
    text-decoration: none;
  }
`

const StyledLink = styled(Link)`
  color: rgba(0, 0, 0, 0.8);
  &:hover {
    color: #327fc7;
    text-decoration: none;
  }
` 
const PostDate = styled.span`
  font-size: 14px;
`

const SideBarPortal = ({ sortedMKData, categoryMKData, contactlists }) => {
  const recentarticlelists = sortedMKData.edges
    .map(edge => edge.node)
    .map(node => ({
      title: node.frontmatter.title,
      date: node.frontmatter.date,
      slug: node.fields.slug
    }))
  const categoryData = categoryMKData.edges.map(edge => edge.node.frontmatter.category)
  const categorylists = Array.from(new Set(categoryData))

  return (
    <SideBarWrapper>
      <RecentPanel>
        {/*Recent blogs panel*/}
        <PanelTitle>Recent Blogs</PanelTitle>
        <ListWrapper>
          {recentarticlelists.map((article, index) => (
            <List key={index}>
              <StyledLink
                to={article.slug}
              >{article.title}</StyledLink>
              <PostDate>{article.date}</PostDate>
            </List>
          ))}
        </ListWrapper>
      </RecentPanel>
      {/*Category panel*/}
      <CategoryPanel>
        <PanelTitle>Category</PanelTitle>
        <ListWrapper>
          {categorylists.map((category, index) => (
            <List selected key={index}>
              <StyledLink>{category}</StyledLink>
            </List>
          ))
          }
        </ListWrapper>      
      </CategoryPanel>
      {/*Contact Panel*/}
      <ContactPanel>
        <PanelTitle>Contact</PanelTitle>
        <ListWrapper>
          {contactlists.map((contact, index) => (
            <ContactList key={index}>
              <i className={`icon ${contact.icon}`} />
              <ContactLink href={contact.link}>{contact.platform}</ContactLink>
            </ContactList>
          ))}
        </ListWrapper>
      </ContactPanel>
    </SideBarWrapper>
  )
}

const contactlists = [
  {
    platform: 'Github',
    link: 'https://github.com/BetaMee',
    icon: 'icon-github'
  },

  {
    platform: 'Weibo',
    link: 'https://www.weibo.com/u/2909438360',
    icon: 'icon-sinaweibo'
  },

  {
    platform: 'Twitter',
    link: 'https://twitter.com/gongxq',
    icon: 'icon-twitter'
  }
]

SideBarPortal.defaultProps = {
  contactlists: contactlists // 联系信息列表
}

export default SideBarPortal
