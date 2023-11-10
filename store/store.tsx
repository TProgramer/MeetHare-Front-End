import create from "zustand";

type member = {
  id: number;
  nickName: string;
  stationName: string;
  latitude: number;
  longitude: number;
};

type room = {
  category: string;
  processivity: string;
  fixDay: any[];
  fixPlace: number;
  fixStation: number;
  submitNumber: number;
  number: number;
  periodStart: string;
  periodEnd: string;
  master: string;
};

interface bearState {
  userId : number;
  myRoomName: string;
  memberList: member[];
  roominfo: room;
  setUserId : any,
  setMyRoomName(newName: string): any;
  setMemberList(newMemberList: member[]): any;
  setRoomInfo(newRoomInfo: room): any;
}

const useRoomInfoStore = create<bearState>((set) => ({
  userId : 0,
  myRoomName: "",
  memberList: [],
  roominfo: {
    category: "",
    processivity: "",
    fixDay: [],
    fixPlace: 0,
    fixStation: 0,
    submitNumber: 0,
    number: 0,
    periodStart: "",
    periodEnd: "",
    master: "",
  },
  setUserId : (newUerId : number) => set({userId : newUerId}),
  setMyRoomName: (newName: string) => set({ myRoomName: newName }),
  setMemberList: (newMemberList: member[]) =>
    set({ memberList: newMemberList }),
  setRoomInfo: (newRoomInfo: room) => set({ roominfo: newRoomInfo }),
}));

export default useRoomInfoStore;
