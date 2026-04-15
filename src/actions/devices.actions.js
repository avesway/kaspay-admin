import { devicesAPI } from '@/api/devices.api';
import { salePointsAPI } from '@/api/salePoints.api';
import { useDevicesStore, useSalePointsStore } from '@/store';
import { toast } from 'sonner';

export async function getListDevices(deviceId) {
  const { setDevices, setLoading, setError, setActiveDevice } = useDevicesStore.getState();
  setLoading({ list: true });

  const devices = await devicesAPI
    .getListDevices()
    .then((res) => {
      if (deviceId) setActiveDevice(res.items.find((item) => item.id === deviceId));
      setDevices(res.items);
      setError({ list: false });
      return res.items;
    })
    .catch((err) => {
      setError({ list: true });
      return [];
    })
    .finally(() => setLoading({ list: false }));

  return devices;
}

export async function getEventsDevice() {
  const { setDeviceEvents, setLoading, setError, updatePaginationEvents, filterEvents, paginationEvents, activeDevice } =
    useDevicesStore.getState();
  const { activeSalePoint } = useSalePointsStore.getState();

  setLoading({ events: true });

  const params = `?from=${filterEvents.from}&to=${filterEvents.to}&salePointIds=${activeSalePoint.id}&deviceIds=${activeDevice.id}&size=${paginationEvents.size}&page=${paginationEvents.page}`;

  const eventsDevice = await devicesAPI
    .getEventsDevices(params)
    .then((res) => {
      setDeviceEvents(res.items);
      updatePaginationEvents({ totalItems: res.totalItems, totalPages: res.totalPages });
      setError({ events: false });
      return res.items;
    })
    .catch((err) => {
      setError({ events: true });
      return [];
    })
    .finally(() => setLoading({ events: false }));

  return eventsDevice;
}

export async function getCommandsDevice() {
  const { setDeviceCommands, setLoading, setError, updatePaginationCommands, filterCommands, paginationCommands, activeDevice } =
    useDevicesStore.getState();

  setLoading({ commands: true });

  const params = `?from=${filterCommands.from}&to=${filterCommands.to}&deviceId=${activeDevice.id}&size=${paginationCommands.size}&page=${paginationCommands.page}`;

  const commandsDevice = await devicesAPI
    .getCommandsDevices(params)
    .then((res) => {
      setDeviceCommands(res.items);
      updatePaginationCommands({ totalItems: res.totalItems, totalPages: res.totalPages });
      setError({ commands: false });
      return res.items;
    })
    .catch((err) => {
      setError({ commands: true });
      return [];
    })
    .finally(() => setLoading({ commands: false }));

  return commandsDevice;
}

export async function getCommandsTypesDevice() {
  const { setDeviceCommandsTypes, setError, setLoading } = useDevicesStore.getState();

  setLoading({ commandsTypes: true });

  await devicesAPI
    .getCommandsTypesDevices()
    .then((res) => {
      setDeviceCommandsTypes(res);
      setError({ commandsTypes: false });
    })
    .catch((err) => setError({ commandsTypes: true }))
    .finally(() => setLoading({ commandsTypes: false }));
}

export async function sendCommandDevice(data, setOpen) {
  const { setLoading } = useDevicesStore.getState();

  setLoading({ sendCommand: true });

  await devicesAPI
    .sendCommandDevices(data)
    .then((res) => {
      toast.success('Команда успешно отправлена', {
        position: 'top-center',
      });
    })
    .catch((err) => {
      toast.error('Ошибка отправки команды', {
        position: 'top-center',
      });
    })
    .finally(() => {
      setLoading({ sendCommand: false });
      setOpen(false);
    });

  getCommandsDevice();
}

export function updatePaginationEventsDevice(size, page) {
  const { updatePaginationEvents } = useDevicesStore.getState();

  updatePaginationEvents({ size, page });

  getEventsDevice();
}

export function updateEventsDeviceFilter(data) {
  const { updateFilterEvents } = useDevicesStore.getState();

  updateFilterEvents(data);

  getEventsDevice();
}

export function updatePaginationCommandsDevice(size, page) {
  const { updatePaginationCommands } = useDevicesStore.getState();

  updatePaginationCommands({ size, page });

  getCommandsDevice();
}

export function updateCommandsDeviceFilter(data) {
  const { updateFilterCommands } = useDevicesStore.getState();

  updateFilterCommands(data);

  getCommandsDevice();
}
