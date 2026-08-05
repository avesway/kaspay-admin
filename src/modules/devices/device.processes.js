import { toast } from 'sonner';

import { devicesAPI } from '@/modules/devices/devices.api';

import { useDevicesStore } from './devices.store';
import { useSalePointsStore } from '../salePoints/salePoints.store';

export async function getListDevices(deviceId, slaveDeviceId) {
  const { setDevices, setLoading, setError, setActiveTerminalDevice, setActiveControllerDevice } = useDevicesStore.getState();
  setLoading({ list: true });

  const devices = await devicesAPI
    .getListDevices()
    .then((res) => {
      if (deviceId) {
        const device = res.items.find((item) => item.id === deviceId);
        setActiveTerminalDevice(device);
        setActiveControllerDevice(device.slaveDevices.find((i) => i.id === slaveDeviceId));
      }
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
  const { setDeviceEvents, setLoading, setError, updatePaginationEvents, filterEvents, paginationEvents, activeTerminalDevice } =
    useDevicesStore.getState();
  const { activeSalePoint } = useSalePointsStore.getState();

  setLoading({ events: true });

  const params = `?from=${filterEvents.from}&to=${filterEvents.to}&salePointIds=${activeSalePoint.id}&deviceIds=${activeTerminalDevice.id}&size=${paginationEvents.size}&page=${paginationEvents.page}`;

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
  const {
    setDeviceCommands,
    setLoading,
    setError,
    updatePaginationCommands,
    filterCommands,
    paginationCommands,
    activeTerminalDevice,
  } = useDevicesStore.getState();

  setLoading({ commands: true });

  const params = `?from=${filterCommands.from}&to=${filterCommands.to}&deviceId=${activeTerminalDevice.id}&size=${paginationCommands.size}&page=${paginationCommands.page}`;

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

export async function getDeviceControllerLatchModes() {
  const { setDeviceControllerLatchModes, setLoading, setError, error } = useDevicesStore.getState();

  try {
    setLoading({ deviceControllerLatchMode: true });

    const latchModes = await devicesAPI.getDeviceControllerLatchModes();
    setDeviceControllerLatchModes(latchModes);

    if (error.deviceControllerLatchMode) setError({ deviceControllerLatchMode: false });
  } catch (error) {
    setError({ deviceControllerLatchMode: true });
  } finally {
    setLoading({ deviceControllerLatchMode: false });
  }
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
