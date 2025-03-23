import os

def setup_project_structure():
    directories = [
        'blockchain', 'ai_verification', 'ip_registration',
        'rights_marketplace', 'dispute_resolution',
        'common', 'docker', 'kubernetes', 'tests'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        with open(os.path.join(directory, 'README.md'), 'w') as f:
            f.write(f'# {directory.capitalize()} Module\n')

setup_project_structure()
