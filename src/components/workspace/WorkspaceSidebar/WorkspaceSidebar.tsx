import { AppLogo, Tooltip } from '@/components/ui';
import AppIcon, { AppIconType } from '@/components/ui/icon';
import { AppData } from '@/constant/AppData';
import { useSettingAction } from '@/hooks/setting.hooks';
import { useWorkspaceActions } from '@/hooks/workspace.hooks';
import { Project } from '@/interfaces/workspace.interface';
import { Form, Input, Popover, Switch } from 'antd';
import Link from 'next/link';
import { FC } from 'react';
import s from './WorkspaceSidebar.module.scss';

export type WorkSpaceMenu = 'code' | 'build' | 'test-cases' | 'setting';
interface MenuItem {
  label: string;
  value: WorkSpaceMenu;
  icon: string;
  private?: boolean;
}

interface Props {
  activeMenu: WorkSpaceMenu;
  onMenuClicked: (name: WorkSpaceMenu) => void;
  projectId: Project['id'];
}

const WorkspaceSidebar: FC<Props> = ({
  activeMenu,
  onMenuClicked,
  projectId,
}) => {
  const { isProjectEditable } = useWorkspaceActions();
  const {
    isContractDebugEnabled,
    toggleContractDebug,
    isFormatOnSave,
    toggleFormatOnSave,
    updateTonAmountForInteraction,
    getTonAmountForInteraction,
    isAutoBuildAndDeployEnabled,
    toggleAutoBuildAndDeploy,
  } = useSettingAction();

  const hasEditAccess = isProjectEditable();

  const menuItems: MenuItem[] = [
    {
      label: 'Code',
      value: 'code',
      icon: 'Code',
    },
    {
      label: 'Build & Deploy',
      value: 'build',
      icon: 'Beaker',
    },
    {
      label: 'Unit Test',
      value: 'test-cases',
      icon: 'Test',
    },
  ];

  const settingContent = () => (
    <div>
      <div className={s.settingItem}>
        <Form.Item
          style={{ marginBottom: 0 }}
          label="Debug Contract"
          valuePropName="checked"
        >
          <Switch
            checked={isContractDebugEnabled()}
            onChange={(toggleState) => {
              toggleContractDebug(toggleState);
            }}
          />
        </Form.Item>
        <p>
          *{' '}
          <small>
            Contract rebuild and redeploy <br /> required after an update
          </small>
        </p>
      </div>
      <div className={s.settingItem}>
        <Form.Item label="Format code on save" valuePropName="checked">
          <Switch
            checked={isFormatOnSave()}
            onChange={(toggleState) => {
              toggleFormatOnSave(toggleState);
            }}
          />
        </Form.Item>
      </div>
      <div className={s.settingItem}>
        <Form.Item
          label="Auto Build & Deploy in Sandbox"
          valuePropName="checked"
        >
          <Switch
            checked={isAutoBuildAndDeployEnabled()}
            onChange={(toggleState) => {
              toggleAutoBuildAndDeploy(toggleState);
            }}
          />
        </Form.Item>
        <p>
          *{' '}
          <small>
            Automatically build and deploy the smart contract after the file is
            saved <br /> if the environment is set to Sandbox.
          </small>
        </p>
      </div>

      <div className={s.settingItem}>
        <Form.Item
          style={{ marginBottom: 0 }}
          label="TON Amount for Interaction"
        >
          <Input
            style={{ marginBottom: 0, width: '6rem' }}
            value={getTonAmountForInteraction() as string}
            onChange={(e) => {
              if (isNaN(Number(e.target.value))) return;
              updateTonAmountForInteraction(e.target.value);
            }}
            placeholder="in TON"
            suffix={
              <div
                title="Reset"
                className={s.resetAmount}
                onClick={() => {
                  updateTonAmountForInteraction('', true);
                }}
              >
                <AppIcon name="Reload" />
              </div>
            }
          />
        </Form.Item>
        <p>
          *{' '}
          <small>
            This amount will be used for all the <br /> contract interaction
            like deployment and sending internal messages.
          </small>
        </p>
      </div>
    </div>
  );

  return (
    <div className={s.container}>
      <div>
        <AppLogo className={s.brandLogo} href="/" />
        {menuItems.map((menu, i) => {
          if (menu.private && !hasEditAccess) {
            return;
          }
          return (
            <Tooltip key={i} title={menu.label} placement="right">
              <div
                className={`${s.action} ${
                  activeMenu === menu.value ? s.isActive : ''
                } ${!projectId ? s.disabled : ''}`}
                onClick={() => {
                  if (!projectId) return;
                  onMenuClicked(menu.value);
                }}
              >
                <AppIcon className={s.icon} name={menu.icon as AppIconType} />
              </div>
            </Tooltip>
          );
        })}
      </div>
      <div>
        {AppData.socials.map((menu, i) => (
          <Tooltip key={i} title={menu.label} placement="right">
            <Link href={menu.url} className={s.action} target="_blank">
              <AppIcon className={s.icon} name={menu.icon as AppIconType} />
            </Link>
          </Tooltip>
        ))}
        <Popover placement="rightTop" title="Setting" content={settingContent}>
          <div className={s.action}>
            <AppIcon className={s.icon} name="Setting" />
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
