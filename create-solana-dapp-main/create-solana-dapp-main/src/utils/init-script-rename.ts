import { log } from '@clack/prompts'
import { join } from 'node:path'
import { ensureTargetPath } from './ensure-target-path'
import { GetArgsResult } from './get-args-result'
import { getPackageJson } from './get-package-json'
import { InitScriptRename } from './init-script-schema'
import { searchAndReplace } from './search-and-replace'
import { namesValues } from './vendor/names'

export async function initScriptRename(args: GetArgsResult, rename?: InitScriptRename, verbose = false) {
  const tag = `initScriptRename`
  const { contents } = getPackageJson(args.targetDirectory)
  // Rename template from package.json to project name throughout the whole project
  if (contents.name) {
    if (args.verbose) {
      log.warn(`${tag}: renaming template name '${contents.name}' to project name '${args.name}'`)
    }
    await searchAndReplace(args.targetDirectory, [contents.name], [args.name], false, verbose)
  }

  // Return early if there are no renames defined in the init script
  if (!rename) {
    if (args.verbose) {
      log.warn(`${tag}: no renames found`)
    }
    return
  }

  // Loop through each word in the rename object
  for (const from of Object.keys(rename)) {
    // Get the 'to' property from the rename object
    const to = rename[from].to.replace('{{name}}', args.name.replace(/-/g, ''))

    // Get the name matrix for the 'from' and the 'to' value
    const fromNames = namesValues(from)
    const toNames = namesValues(to)

    for (const path of rename[from].paths) {
      const targetPath = join(args.targetDirectory, path)
      if (!(await ensureTargetPath(targetPath))) {
        log.error(`${tag}: target does not exist ${targetPath}`)
        continue
      }
      if (args.verbose) {
        log.warn(`${tag}: ${targetPath} -> ${fromNames.join('|')} -> ${toNames.join('|')}`)
      }
      await searchAndReplace(targetPath, fromNames, toNames, args.dryRun, args.verbose)
    }
  }

  if (args.verbose) {
    log.warn(`${tag}: done`)
  }
}
