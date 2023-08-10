import { Tree, SchematicsException } from "@angular-devkit/schematics";

export function getProject(tree: Tree, projectName: string) {
    if (!projectName) {
        throw new SchematicsException('Option (project) is required.');
    }
    const workspaceConfigBuffer = tree.read('angular.json');
    if (!workspaceConfigBuffer) {
        throw new SchematicsException('Not an Angular CLI workspace');
    }
    const workspaceConfig = JSON.parse(workspaceConfigBuffer.toString());
    const project = workspaceConfig?.projects[projectName];
    if (!project) {
        throw new SchematicsException('Project is not defined in this workspace');
    }
    return project;
}

export function getDefaultSourceRoot (project: any): string {
    const sourceRoot = project?.sourceRoot || 'src';
    const prefix = project?.prefix || 'app';
    return `${sourceRoot}/${prefix}`;
}