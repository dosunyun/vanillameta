import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Dashboard, PieChart } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogProps,
  DialogContent,
  DialogActions,
  CircularProgress,
  ListItemButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useInView } from 'react-intersection-observer';
// import { get } from '@/helpers/apiHelper';
import axios from 'axios';

const iconType = item => {
  switch (item) {
    case 'dashboard':
      return <Dashboard />;
    case 'barChart':
      return <BarChart />;
    case 'pieChart':
      return <PieChart />;
    default:
      return;
  }
};

function AddWidgetPopupButton({ label, widgetSelect }) {
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  // const [selectedIds, setSelectedIds] = React.useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadedWidgetData, setLoadedWidgetData] = useState([]);
  const [page, setPage] = useState(1);
  const selectedIds = [];

  const [ref, inView] = useInView();

  const getItems = () => {
    setIsLoading(true);
    axios
      .get('/data/dummyWidgetList.json')
      .then(response => response.data)
      .then(data => data.filter((list, idx) => idx < 10 * page))
      .then(data => setLoadedWidgetData(data));
    setIsLoading(false);
  };

  useEffect(() => {
    getItems();
  }, [getItems]);

  useEffect(() => {
    if (inView && !isLoading) {
      setPage(prevState => prevState + 1);
    }
  }, [inView, isLoading]);

  const descriptionElementRef = useRef<HTMLElement>(null);

  const handleOpenClick = (scrollType: DialogProps['scroll']) => () => {
    // getItems();
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = item => {
    // setSelectedIndex(index);
    const isSelect = isItemSelection(item);
    if (isSelect) {
      const index = selectedIds.indexOf(item.id);
      if (index > -1) {
        selectedIds.splice(index, 1);
      }
    }
  };

  const handleDoubleClick = item => {
    // handleSelect(item);
  };

  const handleSelect = item => {
    // widgetSelect(item);
    // handleClose();
  };

  const isItemSelection = item => {
    let isSelect = false;
    for (let i = 0; i < loadedWidgetData.length; i++) {
      if (loadedWidgetData[i].id == item.id) {
        isSelect = true;
        selectedIds.push(item.id);
        break;
      }
    }
    return isSelect;
  };

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <React.Fragment>
      <Button onClick={handleOpenClick('paper')} variant="contained" endIcon={<AddIcon />} color="primary">
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {label}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="body2" mt={1}>
            추가할 위젯을 선택해주세요.
          </Typography>
        </DialogTitle>

        <DialogContent dividers id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1} sx={{ p: 0 }}>
          <List
            sx={{
              width: '40%',
              minWidth: 400,
              height: '60%',
              minHeight: 300,
              maxHeight: 300,
            }}
          >
            {loadedWidgetData.map((item, index) => (
              <ListItemButton
                key={index}
                selected={isItemSelection(item)}
                onClick={() => handleClick(item)}
                // onDoubleClick={() => handleDoubleClick(item)}
              >
                <ListItemIcon>{iconType(item.type)}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            ))}
            <Box ref={ref} sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress sx={{ color: theme => theme.palette.grey[500] }} />
            </Box>
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            취소
          </Button>
          {/*<Button onClick={() => handleSelect(loadedWidgetData[selectedIndex])}>위젯 추가</Button>*/}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default AddWidgetPopupButton;
