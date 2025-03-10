export interface HeaderProps {
  onLogin?: () => void;
  onLogout?: () => void;
  onCreateAccount?: () => void;
  play: (isPlay: boolean) => void;
  user?: {
    name: string;
  };
}
