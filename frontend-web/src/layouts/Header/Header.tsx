import React from 'react';
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DropMenuButton from '../../components/DropMenuButton';
import Logo from './Logo';
import NavBar from './NavBar';

const menuList = [
  { label: '데이터 소스', url: '/data/connect' },
  { label: '데이터 셋', url: '/data/set' },
  { label: '위젯', url: '/widget/create' },
  { label: '대시보드', url: '/' },
];

function Header(props) {
  const headerHeight = props.height;
  const drawerWidth = 240;

  const navItems = [
    { id: 1, name: '대시보드', url: '/' },
    { id: 2, name: '위젯', url: 'widget' },
    { id: 3, name: '데이터', url: 'data' },
  ];

  // const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} mt={5} sx={{ textAlign: 'center' }}>
      {/*<Logo />*/}
      {/*<Divider />*/}
      <List>
        {navItems.map(item => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton href={item.url} sx={{ textAlign: 'center' }}>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  // const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar elevation={0} component="nav">
        <Toolbar variant="dense" sx={{ height: headerHeight, justifyContent: 'space-between', columnGap: '80px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo />

          <NavBar navItems={navItems} />
          <DropMenuButton button="big" menuList={menuList} />
        </Toolbar>
        <Divider />
      </AppBar>

      <Box component="nav">
        <Drawer
          // container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

export default Header;
