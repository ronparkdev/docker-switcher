import ChildProcess from 'child_process'

import { StringUtil } from '@utils/string'

interface ContainerState {
  containerId: string
  image: string
  command: string
  created: string
  status: string
  port: string
}

const exec = async (command: string): Promise<string> =>
  await new Promise<string>((resolve, reject) => {
    ChildProcess.exec(command, (_, stdout, stderr) => {
      if (stderr.length !== 0) {
        reject(new Error(stderr))
      } else {
        resolve(stdout)
      }
    })
  })

const getContainers = async (): Promise<ContainerState[]> => {
  const result = await exec('docker ps')

  const [header, ...rows] = result.split('\n')
  const EXPECTED_FIELD_NAMES = ['CONTAINER ID', 'IMAGE', 'COMMAND', 'CREATED', 'STATUS', 'PORTS', 'NAMES']

  const offsets = EXPECTED_FIELD_NAMES.map((fieldName) => header.indexOf(fieldName))
  const fields: Array<{ name: string; offsetStart: number; offsetEnd: number }> = EXPECTED_FIELD_NAMES.map(
    (fieldName) => {
      const offsetStart = header.indexOf(fieldName)
      const offsetEnd = Math.min(...offsets.filter((offset) => offset > offsetStart))

      const name = StringUtil.toCamelCase(fieldName)

      return { name, offsetStart, offsetEnd: Number.isNaN(offsetEnd) ? header.length : offsetEnd }
    },
  )

  const containers = rows
    .map((row) => {
      return fields.reduce<Partial<ContainerState>>(
        (value, field) => ({
          ...value,
          [field.name]: row.slice(field.offsetStart, field.offsetEnd).trim(),
        }),
        {},
      ) as ContainerState
    })
    .filter((container) => container.containerId.length > 0)

  return containers
}

interface ContainerRunParameters {
  options?: string[]
  image: string
  command: string
  args?: string[]
}

// alias docker-run-kr="docker run -d --rm -p 80:80 -p 443:443 registry.navercorp.com/shopping/shopping-nginx:1.7"
// alias docker-stop-kr="docker stop \$(docker ps -q --filter ancestor=registry.navercorp.com/shopping/shopping-nginx:1.7)"

// alias docker-run-jp='docker run -d --rm -p 80:80 -p 443:443 jp-smartstore-nginx-image'
// alias docker-stop-jp='docker stop \$(docker ps -q --filter ancestor=jp-smartstore-nginx-image)'

// alias docker-run-v="docker run -d --rm -p 80:80 -p 443:443 vertical-nginx"
// alias docker-stop-v='docker stop \$(docker ps -q --filter ancestor=vertical-nginx)'

const run = async ({ options = [], image, command, args = [] }: ContainerRunParameters): Promise<boolean> => {
  await exec(`docker run ${options.join(' ')} ${image} ${command} ${args.join(' ')}`)

  return false
}

const stop = async (containerId: string): Promise<boolean> => {
  await exec(`docker stop ${containerId}`)

  return true
}

const stopAllByImageName = async (imageName: string): Promise<boolean> => {
  const containers = await getContainers()

  const filteredContainers = containers.filter((container) => container.image === imageName)

  let isSuccess = true

  for (const container of filteredContainers) {
    isSuccess = isSuccess && (await stop(container.containerId))
  }

  return isSuccess
}

export const DockerService = { getContainers, run, stop, stopAllByImageName }
