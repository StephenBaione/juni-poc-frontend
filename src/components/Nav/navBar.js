import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';

import { setShowMenu } from '../../data/slices/display/displaySlice';

import UserService from '../../services/userService';

import UserAvatar from '../UI/UserAvatar';

import { routeMap } from '../utils';
import { MenuBookOutlined } from '@mui/icons-material';
import { getDefaultNormalizer } from '@testing-library/react';

import theme from '../../Theme';

export default function NavBar() {
  const dispatch = useDispatch();

  const showMenu = useSelector(state => state.display.showMenu);
  const currentUser = useSelector(state => state.currentUser);

  const navigate = useNavigate();

  const userService = new UserService();

  const goTo = (routeKey) => {
    const route = routeMap[routeKey];

    if (route) {
      return navigate(route);
    }
  }

  // Account Menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [avatarUrl, setAvatarUrl] = React.useState(null);
  
  // set avatar url
  if (!currentUser.userPresent) {
    userService.getDefaultUserAvatarUrl()
      .then((response) => {
        setAvatarUrl(response);
    })
  } else {
    if (avatarUrl != currentUser.user.avatar_url) {
      setAvatarUrl(currentUser.user.avatar_url);
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        padding="30px"
        color="transparent"
        sx={{
          background: theme.palette.pinkGradient.main
        }}
      >
        <Toolbar
          color='white'
          sx={{ justifyContent: 'space-between' }}
        >
          <Box>
            {/* ---- Icon ---- */}
            <IconButton
              size="normal"
              edge="start"
              // color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,

                "&:hover": {
                  background: 'black'
                }
              }}
              onClick={() => { dispatch(setShowMenu(!showMenu)) }}
            >
              <MenuIcon
                style={{
                  color: 'white'
                }}
              />
            </IconButton>

            {/* ---- Home ---- */}
            <Button
              size="normal"
              edge="start"
              // color="inherit"
              aria-label="Home"
              sx={{
                mr: 2,

                "&:hover": {
                  background: 'black'
                }
              }}
              onClick={() => { goTo('home') }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}>
                Home
              </Typography>
            </Button>

            <Button
              size="normal"
              edge="start"
              // color="inherit"
              aria-label="Flow"
              sx={{
                mr: 2,

                "&:hover": {
                  background: 'black'
                }
              }}
              onClick={() => { goTo('flow') }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}>
                Flow
              </Typography>
            </Button>

            {/* ---- Avatar ---- */}
            <Button
              size="normal"
              edge="start"
              // color="inherit"
              aria-label="menu"
              sx={{
                mr: 2,

                "&:hover": {
                  background: 'black'
                }
              }}

              onClick={() => { goTo('avatar') }}
            >
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}>
                Avatar
              </Typography>
            </Button>

          </Box>

          {/* ---- Account Menu ---- */}

          {
            currentUser.userPresent &&
            <React.Fragment>
              <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                  >
                    <UserAvatar avatarUrl={avatarUrl} size={50}/>
                  </IconButton>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: 'visible',
                    filter: `drop-shadow(0px 2px 8px ${theme.palette.dropShadow.main})`,
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'white',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                 {/* ---- Profile ---- */}
                <MenuItem 
                  sx={{
                    "&:hover": {
                      background: 'black',
                      color: 'white',
                      transition: '0.2s ease-in-out'
                    }
                  }}
                  onClick={() => {handleClose(); goTo('profile')}}
                >
                  <UserAvatar avatarUrl={avatarUrl} size={50}/> My Profile
                </MenuItem>

                <Divider />

                {/* <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Settings fontSize="small" />
                  </ListItemIcon>
                  Settings
                </MenuItem> */}

                {/* ---- Logout ---- */}
                {
                  currentUser.userPresent &&
                  <MenuItem 
                    sx={{
                      "&:hover": {
                        background: 'black',
                        color: 'white',
                        transition: '0.2s ease-in-out',

                        '& .MuiListItemIcon-root': {
                          color: 'white',
                          transition: '0.2s ease-in-out'
                        }
                      }
                    }}
                    onClick={() => {handleClose(); userService.logout()}}
                  >
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                    Logout
                  </MenuItem>
                }
              </Menu>
            </React.Fragment>
          }
        
          {/* ---- Login ---- */}

          {
            !currentUser.userPresent &&
            <Button
              // color="inherit"
              sx={{ mr: 2 }}

              onClick={() => { goTo('login') }}
            >
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "white" }}>
                Login
              </Typography>
            </Button>
          }
          
        </Toolbar>
      </AppBar>
    </Box>
  );
}