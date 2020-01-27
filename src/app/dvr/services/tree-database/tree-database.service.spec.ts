import { TreeDatabaseService } from './tree-database.service';

describe('TreeDatabaseService', () => {
  let service: TreeDatabaseService;

  beforeEach(() => {
    service = new TreeDatabaseService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
