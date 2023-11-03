import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RiPencilLine } from 'react-icons/ri';
import { HiViewBoards } from 'react-icons/hi';
import { VscNewFile } from 'react-icons/vsc';
import { BsFillPeopleFill } from 'react-icons/bs';
import { FiSettings } from 'react-icons/fi';
import { IoMdList } from 'react-icons/io';
import { FaDailymotion } from 'react-icons/fa';
import { AiOutlineCaretDown, AiOutlineCaretRight, AiOutlineLink } from 'react-icons/ai';
import ReactDOM from 'react-dom';
import ProjectHeaderNav from './ProjectHeaderNav/ProjectHeaderNav';
import styles from './NavigationV2.module.scss';
import addshorcut from '../../assets/addshorcut.svg';
import { ProjectContext, ProjectDispatchContext } from '../../../context/ProjectProvider';
import Modal from '../../../lib/Modal/Modal';
import DefaultModalHeader from '../../../lib/Modal/ModalHeader/DefaultModalHeader/DefaultModalHeader';
import { IShortcutData, IProject, IProjectData } from '../../../types';
import checkAccess from '../../../utils/helpers';
import DailyScrum from '../../DailyScrum/DailyScrum';
import ShortcutModal from '../../Modals/ShortcutModal/ShortcutModal';
import NavigationLayout from '../../Navigation/NavigationLayout/NavigationLayout';

interface IItem {
  name: string;
  url: string | null;
  checkAccess: string | null;
  icon: React.ReactNode;
  dataTestId: string;
}
export default function Nav() {
  const navigate = useNavigate();
  const [showDailyScrum, setShowDailyScrum] = useState(false);
  const [operation, setOperation] = useState('');
  const [selectedLink, setSelectedLink] = useState<IShortcutData | null>(null);
  const [addLinkToggle, setAddLinkToggle] = useState(false);
  const { projectId = '' } = useParams();
  const [showBtns, setShowBtns] = useState({
    planning: true,
    tracking: true,
    shortcuts: true,
    utility: true
  });
  const projectList = useContext<IProject[]>(ProjectContext);
  const fetchProjects = useContext(ProjectDispatchContext);
  const currentProject: IProjectData = projectList.filter(
    (project: IProjectData) => project.id === projectId
  )[0];

  if (!currentProject) {
    return (
      <div id="projectDropdownNav">
        <nav className={styles.container} />
      </div>
    );
  }

  const { boardId } = currentProject;

  const buttons = {
    planning: [
      {
        name: 'Board',
        url: `/projects/${projectId}/board/${boardId}`,
        icon: <HiViewBoards />,
        dataTestId: 'board-btn-old'
      },
      {
        name: 'Backlog',
        url: `/projects/${projectId}/board/${boardId}/backlog`,
        icon: <IoMdList />,
        dataTestId: 'backlog-btn-old'
      }
    ],
    tracking: [
      {
        name: 'Daily scrum',
        icon: <FaDailymotion />,
        dataTestId: 'dailyscrum-btn-old'
      }
    ],
    utility: [
      {
        name: 'Members',
        checkAccess: 'view:members',
        url: `/projects/${currentProject?.id}/members`,
        icon: <BsFillPeopleFill />,
        dataTestId: 'member-btn-old'
      },
      {
        name: 'Project Settings',
        checkAccess: 'view:settings',
        url: `/settings/${currentProject?.id}`,
        icon: <FiSettings />,
        dataTestId: 'project-settings-btn-old'
      }
    ]
  };

  const setShowBtnState = (category: string) => {
    setShowBtns({ ...showBtns, [category]: !showBtns[category] });
  };

  const renderCategoryBtn = (categoryType: string) => {
    return (
      <button
        className={styles.category}
        onClick={() => {
          setShowBtnState(categoryType);
        }}
      >
        <span>{showBtns[categoryType] ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
        {categoryType.toUpperCase()}
      </button>
    );
  };

  const renderBtn = (item: IItem) => {
    return (
      <button
        data-testid={item.dataTestId}
        className={styles.navBtn}
        onClick={() => {
          if (item.url) {
            navigate(item.url);
          } else {
            setShowDailyScrum(true);
          }
        }}
        key={item.name}
      >
        {item.icon}
        <span>{item.name}</span>
      </button>
    );
  };

  return (
    <NavigationLayout>
      <div>
        <ProjectHeaderNav currentProject={currentProject} />
        {Object.keys(buttons).map((category) => {
          return (
            <React.Fragment key={category}>
              <div className={styles.section}>
                {renderCategoryBtn(category)}
                {showBtns[category] &&
                  buttons[category].map((item: IItem) => {
                    return renderBtn(item);
                  })}
              </div>
              <div className={styles.dividingLine} />
            </React.Fragment>
          );
        })}

        {showDailyScrum && (
          <DailyScrum
            onClickCloseModal={() => {
              setShowDailyScrum(false);
            }}
            projectId={currentProject?.id}
          />
        )}

        <div className={styles.section}>
          <button
            className={styles.category}
            onClick={() => {
              setShowBtnState('shortcuts');
            }}
          >
            <span>{showBtns.shortcuts ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}</span>
            SHORTCUTS
          </button>
          {showBtns.shortcuts &&
            currentProject?.shortcut.map((shortcutData: IShortcutData) => {
              return (
                <React.Fragment key={shortcutData.id}>
                  <a
                    href={
                      shortcutData.shortcutLink && shortcutData.shortcutLink.includes('https://')
                        ? shortcutData.shortcutLink
                        : `https://${shortcutData.shortcutLink}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    data-testid={`shortcut-${shortcutData.id}`}
                    className={styles.navBtn}
                  >
                    <AiOutlineLink />
                    <span className={styles.shortcutContent}>{shortcutData.name}</span>
                    {checkAccess('add:shortcut', projectId) && (
                      <button
                        type="button"
                        className={styles.pencil}
                        onClick={(e) => {
                          e.preventDefault();
                          setAddLinkToggle(!addLinkToggle);
                          setOperation('Edit');
                          setSelectedLink(shortcutData);
                        }}
                      >
                        <RiPencilLine className={styles.pencilLine} />
                      </button>
                    )}
                  </a>
                </React.Fragment>
              );
            })}
          {showBtns.shortcuts && checkAccess('add:shortcut', projectId) && (
            <button
              className={styles.navBtn}
              type="button"
              onClick={() => {
                setAddLinkToggle(!addLinkToggle);
                setOperation('Add');
                setSelectedLink(null);
              }}
              data-testid="add-shortcut"
            >
              <VscNewFile />
              <span className={styles.modalTitle}>Add shortcut</span>
            </button>
          )}
          {addLinkToggle &&
            ReactDOM.createPortal(
              <Modal classesName={[styles.shortcutModal, 'clear'].join(' ')}>
                <DefaultModalHeader
                  title="Shortcut"
                  onClickClose={() => {
                    setAddLinkToggle(false);
                  }}
                />
                <img src={addshorcut} alt="shortcut" className={styles.shortcutImg} />
                <ShortcutModal
                  operation={operation}
                  setAddLinkToggle={setAddLinkToggle}
                  addLinkToggle={addLinkToggle}
                  selectedLink={selectedLink}
                  currentProjectId={currentProject?.id}
                  shortCutAdded={() => {
                    setAddLinkToggle(false);
                    fetchProjects();
                  }}
                  shortCutUpdated={fetchProjects}
                />
              </Modal>,
              document.body
            )}
        </div>

        <div className={styles.dividingLine} />
        <div className={styles.section}>
          <button
            className={styles.navBtn}
            type="button"
            onClick={() => {
              setAddLinkToggle(!addLinkToggle);
              setOperation('Add');
              setSelectedLink(null);
            }}
            data-testid="add-shortcut"
          >
            <VscNewFile />
            <span>User</span>
          </button>
        </div>
      </div>
    </NavigationLayout>
  );
}
