import React, { useLayoutEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import PageContainer from '@/components/PageContainer';
import PageTitleBox from '@/components/PageTitleBox';
import TitleBox from '@/components/TitleBox';
import ImgCardList from '@/components/ImgCardList';
import ConfirmCancelButton from '@/components/button/ConfirmCancelButton';
import DatabaseService from '@/api/databaseService';
import { STATUS } from '@/constant';
import { getDatabaseIcon } from '@/widget/utils/iconUtil';
import { Link as RouterLink, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import DatabaseForm from '@/pages/Data/DataSource/form/DatabaseForm';
import AddButton from '@/components/button/AddButton';

function DataSource() {
  const { sourceId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const alert = useAlert();
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [dataType, setDataType] = useState(null);
  const [typeList, setTypeList] = useState([]);
  const [formData, setFormData] = useState({
    databaseName: '',
    host: '',
    port: '',
    user: '',
    password: '',
    database: '',
  });

  useLayoutEffect(() => {
    getDatabaseTypeList();
    console.log('modify', pathname.indexOf('modify'));
    console.log('sourceId', sourceId);

    if (pathname.indexOf('modify') > 0 && sourceId) {
      // 데이터셋 수정일 경우
      setIsModifyMode(true);
      getDatabaseInfo();
    }
  }, []);

  /**
   * 수정일 경우 데이터베이스 정보 조회
   */
  const getDatabaseInfo = () => {
    DatabaseService.selectDatabase(sourceId).then(response => {
      // console.log('getDatabaseInfo', response.data.data.databaseInfo);
      const info = response.data;
      if (info.status === 'SUCCESS') {
        console.log(info.data.databaseInfo.connectionConfig);
        setFormData(info.data.databaseInfo.connectionConfig);
      }
    });
  };

  const testConnect = item => {
    console.log('testConnect ', item);

    const param = {
      name: item.name,
      description: item.name,
      connectionConfig: item,
      engine: dataType.type,
    };
    DatabaseService.testConnection(param).then(response => {
      console.log(response);
      if (response.data.status === STATUS.SUCCESS) {
        setIsConnected(true);
      } else {
        alert.info('데이터 베이스에 연결할 수 없습니다.\n데이터 베이스 정보를 확인해주세요.');
      }
    });
  };

  const getDatabaseTypeList = () => {
    DatabaseService.selectDatabaseTypeList().then(response => {
      console.log('selectDatabaseTypeList', response.data);
      if (response.data.status === STATUS.SUCCESS) {
        const list = response.data.data;
        list.map(item => (item.icon = getDatabaseIcon(item.type)));
        setTypeList(list);
        if (list.length > 0) {
          setDataType(list[0]);
        }
      }
    });
  };

  const handleSaveClick = () => {
    const param = {
      name: formData.databaseName,
      description: formData.databaseName,
      connectionConfig: formData,
      engine: dataType.type,
    };

    alert.success(`데이터베이스를 ${isModifyMode ? '수정' : '생성'}하시겠습니까?`, {
      closeCopy: '취소',
      actions: [
        {
          copy: '확인',
          onClick: () => {
            if (isModifyMode) {
              DatabaseService.updateDatabase(sourceId, param).then(response => {
                console.log(response.data);
                if (response.data.status === STATUS.SUCCESS) {
                  console.log('데이터 베이스 저장', param);
                  alert.info('데이터베이스가 수정되었습니다.', {
                    onClose: () => {
                      navigate('/data');
                    },
                  });
                }
              });
            } else {
              DatabaseService.createDatabase(param).then(response => {
                if (response.data.status === STATUS.SUCCESS) {
                  alert.info('데이터베이스가 생성되었습니다.', {
                    onClose: () => {
                      navigate('/data');
                    },
                  });
                }
              });
            }
          },
        },
      ],
    });
  };

  const handleCancelClick = () => {
    navigate('/data');
  };

  return (
    <PageContainer>
      <PageTitleBox
        title={'데이터 소스 연결'}
        button={
          <ConfirmCancelButton
            confirmProps={{ disabled: false, onClick: handleSaveClick }}
            cancelProps={{ onClick: handleCancelClick }}
          />
        }
        sx={{ p: 0 }}
      >
        <Stack sx={{ width: '100%' }}>
          <Stack sx={{ p: '30px 24px 50px 24px' }}>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'bold', fontSize: '18px', color: '#141414', mb: '14px' }}
            >
              step.01 타입 설정
            </Typography>
            <ImgCardList data={typeList} selectedType={dataType} setSelectedType={setDataType} />
          </Stack>
          <Stack sx={{ p: '30px 24px 50px 24px', bgcolor: '#f5f6f8' }}>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ fontWeight: 'bold', fontSize: '18px', color: '#141414', mb: '14px' }}
            >
              step.02 연결 정보 입력
            </Typography>
            <DatabaseForm testConnect={testConnect} formData={formData} setFormData={setFormData} />
          </Stack>
        </Stack>
      </PageTitleBox>
    </PageContainer>
  );
}

export default DataSource;
