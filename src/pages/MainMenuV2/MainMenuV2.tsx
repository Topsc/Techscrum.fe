import React, { useContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  AiOutlineCalendar,
  AiOutlineFolderOpen,
  AiOutlineSearch,
  AiOutlineUser
} from 'react-icons/ai';
import { FiSettings } from 'react-icons/fi';
import { MdList, MdLogout } from 'react-icons/md';
import { TbReportMoney, TbReportSearch } from 'react-icons/tb';
import { VscChecklist } from 'react-icons/vsc';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavigationBtn from '../../components/Navigation/NavigationBtn/NavigationBtn';
import NavigationLayout from '../../components/Navigation/NavigationLayout/NavigationLayout';
import { UserContext, UserDispatchContext } from '../../context/UserInfoProvider';
import styles from './MainMenuV2.module.scss';
import avatarImg from '../../assets/userAvatar.png';
import SubProjectMenu from '../ProjectPage/SubProjectMenu/SubProjectMenu';
import { IProject } from '../../types';
import { ProjectContext } from '../../context/ProjectProvider';
import config from '../../config/config';

const btnsForDomainOwner = [
  {
    id: 'projects',
    name: 'Projects',
    url: `/projects`,
    icon: <AiOutlineFolderOpen />,
    dataTestId: 'projects-nav-btn'
  },
  {
    id: 'myWork',
    name: 'My Work(WIP)',
    url: `/my-work`,
    icon: <VscChecklist />,
    dataTestId: 'my-work-nav-btn'
  },
  {
    id: 'calendar',
    name: 'Calendar(WIP)',
    checkAccess: 'view:calendar',
    url: `/my-calendar`,
    icon: <AiOutlineCalendar />,
    dataTestId: 'my-calendar-nav-btn'
  },
  {
    id: 'report',
    name: 'Report(WIP)',
    checkAccess: 'view:reports',
    url: `/my-report`,
    icon: <TbReportSearch />,
    dataTestId: 'my-report-nav-btn'
  }
];

const btnsForOthers = btnsForDomainOwner.filter((e) => e.id !== 'billing');

export default function MainMenuV2() {
  const navigate = useNavigate();
  const [showUserSettingsModal, setShowUserSettingsModal] = useState(false);
  const [toggleSearchMenu, setToggleSearchMenu] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const setUserInfo = useContext(UserDispatchContext);
  const userInfo = useContext(UserContext);
  const { id: userId } = userInfo;
  const projectList = useContext<IProject[]>(ProjectContext);

  const btnsArray = isOwner ? btnsForDomainOwner : btnsForOthers;

  const logout = () => {
    localStorage.clear();
    setUserInfo({});
    navigate('/');
  };

  useEffect(() => {
    const fetchData = async () => {
      const isOwnerBoolean = await axios.post(`${config.apiAddress}/domains/owner`, {
        userId
      });
      setIsOwner(isOwnerBoolean.data);
    };
    fetchData();
  }, [userId]);

  const renderModals = () => {
    return (
      showUserSettingsModal &&
      ReactDOM.createPortal(
        <div className={styles.userSettings}>
          <div className={styles.item}>
            <img src={userInfo?.avatarIcon || avatarImg} alt="avatar" />
            {userInfo.name}
          </div>
          <hr />
          <Link to="/me" className={styles.item}>
            <FiSettings />
            User Settings
          </Link>
          <div className={styles.item}>
            <MdList />
            Preferences (WIP)
          </div>
          {isOwner && (
            <Link to="/billing/info/overview" className={styles.item}>
              <TbReportMoney />
              Plan & billing
            </Link>
          )}
          <hr />
          <button className={styles.item} onClick={logout}>
            <MdLogout />
            Logout
          </button>
        </div>,
        document.body
      )
    );
  };

  return (
    <>
      <NavigationLayout>
        <button
          className={styles.searchBtn}
          onClick={() => {
            setToggleSearchMenu(!toggleSearchMenu);
          }}
          data-testid="search-btn"
        >
          <AiOutlineSearch className={styles.searchIcon} />
          Search
        </button>
        {btnsArray.map((item) => {
          return (
            <NavigationBtn
              key={item.name}
              dataTestId={item.dataTestId}
              onClick={() => {
                if (item.url) {
                  setToggleSearchMenu(false);
                  navigate(item.url);
                }
              }}
            >
              {item.icon}
              {item.name}
            </NavigationBtn>
          );
        })}
        <NavigationBtn
          dataTestId="user-settings"
          classesName={styles.userSettingsBtn}
          onClick={() => {
            setShowUserSettingsModal(!showUserSettingsModal);
          }}
        >
          <AiOutlineUser />
          Settings
        </NavigationBtn>
        {renderModals()}
      </NavigationLayout>

      <SubProjectMenu
        toggleSearchMenu={toggleSearchMenu}
        projectList={projectList}
        closeModal={() => {
          setToggleSearchMenu(false);
        }}
      />
    </>
  );
}
