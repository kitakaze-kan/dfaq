import { atom, useAtom, useSetAtom } from "jotai";

export const showTopicModal = atom<boolean>(false);

export const useShowModal = () => useAtom(showTopicModal);
export const useSetModal = () => useSetAtom(showTopicModal);

export const showConnectWalletModal = atom<boolean>(false);

export const useShowConnectWalletModal = () => useAtom(showConnectWalletModal);
export const useSetConnectWalletModal = () =>
  useSetAtom(showConnectWalletModal);
