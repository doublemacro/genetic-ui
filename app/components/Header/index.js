import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import A from './A';
import Img from './Img';
import NavBar from './NavBar';
import HeaderLink from './HeaderLink';
import Banner from './banner.jpg';
import messages from './messages';

const HeaderWrapper = styled.header`
  grid-row: 1;
  grid-column: 1 / 4;

  padding-left: 3%;
`;

function Header() {
  return (
    <HeaderWrapper>
      <div>
        g e n e t i c
      </div>
    </HeaderWrapper>
  );
}

export default Header;
