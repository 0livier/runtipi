import { IconDownload, IconExternalLink, IconPlayerPause, IconPlayerPlay, IconSettings, IconTrash, IconX, TablerIcon } from '@tabler/icons';
import clsx from 'clsx';
import React from 'react';
import type { AppStatus } from '../../../../../server/services/apps/apps.types';

import { Button } from '../../../../components/ui/Button';
import { AppInfo } from '../../../../core/types';

interface IProps {
  info: AppInfo;
  status?: AppStatus;
  updateAvailable: boolean;
  onInstall: () => void;
  onUninstall: () => void;
  onStart: () => void;
  onStop: () => void;
  onOpen: () => void;
  onUpdate: () => void;
  onUpdateSettings: () => void;
  onCancel: () => void;
}

interface BtnProps {
  Icon?: TablerIcon;
  onClick: () => void;
  width?: number | null;
  title?: string;
  color?: string;
  loading?: boolean;
}

const ActionButton: React.FC<BtnProps> = (props) => {
  const { Icon, onClick, title, loading, color, width = 140 } = props;

  return (
    <Button loading={loading} data-testid={`action-button-${title?.toLowerCase()}`} onClick={onClick} width={width} className={clsx('me-2 px-4 mt-2', [`btn-${color}`])}>
      {title}
      {Icon && <Icon className="ms-1" size={14} />}
    </Button>
  );
};

export const AppActions: React.FC<IProps> = ({ info, status, onInstall, onUninstall, onStart, onStop, onOpen, onUpdate, onCancel, updateAvailable, onUpdateSettings }) => {
  const hasSettings = Object.keys(info.form_fields).length > 0 || info.exposable;

  const buttons: JSX.Element[] = [];

  const StartButton = <ActionButton key="start" Icon={IconPlayerPlay} onClick={onStart} title="Start" color="success" />;
  const RemoveButton = <ActionButton key="remove" Icon={IconTrash} onClick={onUninstall} title="Remove" color="danger" />;
  const SettingsButton = <ActionButton key="settings" Icon={IconSettings} onClick={onUpdateSettings} title="Settings" />;
  const StopButton = <ActionButton key="stop" Icon={IconPlayerPause} onClick={onStop} title="Stop" color="danger" />;
  const OpenButton = <ActionButton key="open" Icon={IconExternalLink} onClick={onOpen} title="Open" />;
  const LoadingButtion = <ActionButton key="loading" loading onClick={() => null} color="success" title="Loading" />;
  const CancelButton = <ActionButton key="cancel" Icon={IconX} onClick={onCancel} title="Cancel" />;
  const InstallButton = <ActionButton key="install" onClick={onInstall} title="Install" color="success" />;
  const UpdateButton = <ActionButton key="update" Icon={IconDownload} onClick={onUpdate} width={null} title="Update" color="success" />;

  switch (status) {
    case 'stopped':
      buttons.push(StartButton, RemoveButton);
      if (hasSettings) {
        buttons.push(SettingsButton);
      }
      if (updateAvailable) {
        buttons.push(UpdateButton);
      }
      break;
    case 'running':
      buttons.push(StopButton);
      if (!info.no_gui) {
        buttons.push(OpenButton);
      }
      if (hasSettings) {
        buttons.push(SettingsButton);
      }
      if (updateAvailable) {
        buttons.push(UpdateButton);
      }
      break;
    case 'installing':
    case 'uninstalling':
    case 'starting':
    case 'stopping':
    case 'updating':
      buttons.push(LoadingButtion, CancelButton);
      break;
    case 'missing':
      buttons.push(InstallButton);
      break;
    default:
      break;
  }

  return <div className="d-flex justify-content-center flex-wrap">{buttons.map((button) => button)}</div>;
};