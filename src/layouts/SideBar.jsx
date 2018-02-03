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

const SideBarPortal = ({ recentarticlelists,  categorylists, contactlists }) =>
  <SideBarWrapper>
    <RecentPanel>
      {/*Recent blogs panel*/}
      <PanelTitle>Recent Blogs</PanelTitle>
      <ListWrapper>
        {recentarticlelists.map((article, index) => (
          <List key={index}>
            <StyledLink>{article.title}</StyledLink>
            <PostDate>{article.updateAt}</PostDate>
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
          <List key={index}>
            <StyledLink>{contact.platform}</StyledLink>
          </List>
        ))}
      </ListWrapper>
    </ContactPanel>
  </SideBarWrapper>

// mock数据
const recentarticlelists = [
  {
    title: 'Preview the new Organization Invitation API', // 标题
    updateAt: '', // 更新时间戳
    publishAt: '2018-10-1', // 初次发表时间戳，这里的2018-1-10只是用于展示，具体时间戳有所不同
    articleId: '' // 文章ID
  },
  {
    title: 'Team Review Requests API becomes an official part of API v3',
    updateAt: '2018-10-1',
    articleId: ''
  },
  {
    title: 'Issue Events API - Dismissed Review Event State',
    updateAt: '2018-10-1',
    articleId: ''
  }
]

const categorylists = [
  'Issues',
  'JavaScript Logs',
  'Node Logs',
  'Python Logs',
  'WebDesign Logs',
  'Life Logs'
]

const contactlists = [
  {
    platform: 'Weibo',
    link: 'www.github.com',
    icon: ''
  },

  {
    platform: 'Weibo',
    link: 'www.github.com',
    icon: ''
  },

  {
    platform: 'Weibo',
    link: 'www.github.com',
    icon: ''
  }
]

SideBarPortal.defaultProps = {
  recentarticlelists: recentarticlelists, // 最近文章列表
  categorylists: categorylists, // 类别别表
  contactlists: contactlists // 联系信息列表
}

export default SideBarPortal
