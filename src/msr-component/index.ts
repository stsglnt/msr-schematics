import {
    apply,
    applyTemplates,
    chain,
    externalSchematic,
    MergeStrategy,
    mergeWith,
    move,
    Rule, SchematicsException,
    Tree,
    url
} from '@angular-devkit/schematics';
import { normalize, strings } from '@angular-devkit/core';
import { MsrComponentSchema } from "./msr-component";
import { getDefaultSourceRoot, getProject } from "./util/project";

export function msrComponentGenerator(options: MsrComponentSchema): Rule {
  return (tree: Tree) => {
    if (!tree.exists('angular.json')) {
      throw new SchematicsException('This is not an Angular workspace. Try again in an Angular project.');
    }
    options.project = options.project ?? 'medical-review';
    const project = getProject(tree, options.project);

    if (!options.path) {
      options.path = getDefaultSourceRoot(project);
    }

    const templateSource = apply(
        url('./files'), [
          applyTemplates({
            classify: strings.classify,
            dasherize: strings.dasherize,
            name: options.name
          }),
          move(normalize(`/${options.path}/${strings.dasherize(options.name)}`))
        ]
    )
    return chain([
        externalSchematic('@schematics/angular', 'component', {
            ...options,
            style: 'scss',
            skipImport: true,
        }),
        mergeWith(templateSource, MergeStrategy.Overwrite)
    ]);
  };
}
