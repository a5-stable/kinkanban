import React, { useEffect, useState } from 'react';
import axios from 'axios';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Cookies from "js-cookie"
import { ListItemSecondaryAction, ListItemText } from '@mui/material';
import client from '../../lib/api/client';


interface List {
  id: number;
  name: string;
}

interface FormData {
  id?: number;
  name: string;
  // 他の属性がここに追加される可能性があります
}

// ヘッダーを取得する関数を作成
const getHeaders = () => {
  const accessToken = Cookies.get("_access_token");
  const client = Cookies.get("_client");
  const uid = Cookies.get("_uid");

  const headers: Record<string, string> = {};

  if (accessToken) headers["access-token"] = accessToken;
  if (client) headers["client"] = client;
  if (uid) headers["uid"] = uid;

  return headers;
};

const ListPage: React.FC = () => {
  const [lists, setLists] = useState<List[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '' });
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await client.get('lists', {
          headers: getHeaders(), // getHeaders関数が正しく定義されていることを確認してください
        });
        setLists(response.data);
      } catch (error) {
        console.error('Error fetching lists:', error);
      }
    };

    fetchLists();
  }, []);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleOpen = (item: List | null) => {
    if (item) {
      setFormData({ id: item.id, name: item.name });
    } else {
      setFormData({ name: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    if (formData.id) {
      editItem(formData.id);
    } else {
      createItem();
    }
  };

  const handleSubmitAndClose = () => {
    handleSubmit();
    handleClose();
  }

  const handleNavigate = (id: number) => {
    navigate(`/lists/${id}`);
  }

  const createItem = () => {
    client.post(`lists`, formData, { headers: getHeaders() })
      .then(response => {
        setLists([response.data, ...lists]);
        setFormData({ name: '' });
      })
      .catch(error => console.error('Error creating item:', error));
  }

  const editItem = (itemId: number) => {
    client.patch(`lists/${itemId}`, formData)
      .then(response => {
        setLists(lists.map(item => 
          item.id === formData.id ? response.data : item
        ));
      })
      .catch(error => console.error('Error updating item:', error));
  };

  const deleteItem = (itemId: number) => {
    client.delete(`lists/${itemId}`)
      .then(() => {
        setLists(lists.filter(item => item.id !== itemId));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const isEdit = formData.id !== undefined;

  return (
    <div>
      <h1>TODOリスト一覧</h1>
      <Button variant="outlined" onClick={() => handleOpen(null)}>
        新しいリストを追加
      </Button>
      <List>
        {lists.map((item) => (
          <List
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            style={{ cursor: 'pointer' }}
          >
            <ListItemText primary={item.name} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleOpen(item)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => deleteItem(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </List>
        ))}
      </List>

      {/* Dialog for adding and editing list */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEdit ? 'リストを編集' : '新しいリストを追加'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEdit
              ? 'リスト名を編集してください'
              : '新しいリスト名を入力してください'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name='name'
            label="リスト名"
            fullWidth
            variant="standard"
            defaultValue={formData?.name}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>キャンセル</Button>
          <Button
            onClick={handleSubmitAndClose}
            disabled={!formData.name.trim()}
          >
            {isEdit ? '更新' : '追加'}
          </Button>
          {!isEdit && (
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim()}
            >
              つづけて追加
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListPage;
